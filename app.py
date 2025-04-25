import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from config import google_api_key # Import the API key
import re
from prompt_utils import format_svg_prompt, format_analysis_prompt # Import the prompt formatting utility and new function
from typing import Optional, Dict, Any # Import Dict, Any
from dotenv import load_dotenv
import base64
from io import BytesIO
from PIL import Image

# --- Configuration & Model Initialization ---
# Remove global model initialization - it will be created per request
# model: Optional[genai.GenerativeModel] = None
generation_config: Optional[genai.types.GenerationConfig] = None

load_dotenv()

# Configure the Gemini API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")
genai.configure(api_key=api_key)

if google_api_key:
    try:
        genai.configure(api_key=google_api_key)
        # Remove global model init
        # model = genai.GenerativeModel('gemini-2.0-flash')
        # Hard-set temperature to 1.0
        generation_config = genai.types.GenerationConfig(temperature=1.0)
    except Exception as e:
        print(f"Error configuring Google AI SDK: {e}")
else:
    print("Warning: Google AI API Key not found. AI features will be disabled.")

app = Flask(__name__)

# --- Helper Functions ---

def _clean_svg_response(raw_text: str) -> Optional[str]:
    """Cleans the raw AI response to extract only the SVG code."""
    if not raw_text:
        return None

    svg_code = raw_text.strip()

    # Attempt 1: Use regex to find the main <svg>...</svg> block
    match = re.search(r'<svg.*?</svg>', svg_code, re.DOTALL | re.IGNORECASE)
    if match:
        svg_code = match.group(0)
    else:
        # Fallback: Remove potential markdown fences if no <svg> block found
        if svg_code.startswith("```"):
            # Remove first line (e.g., ```svg or ```xml)
            parts = svg_code.split('\n', 1)
            svg_code = parts[1] if len(parts) > 1 else ''
        if svg_code.endswith("```"):
            svg_code = svg_code[:-3]
        svg_code = svg_code.strip()

    # Final validation: check if it looks like SVG after cleaning
    if svg_code.startswith('<svg') and svg_code.endswith('</svg>'):
        return svg_code
    else:
        print(f"Warning: Model output could not be cleaned into valid SVG:\n{raw_text}")
        return None

# --- Routes ---

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_svg():
    """Handles SVG generation requests using the selected model."""
    if not google_api_key or not generation_config: # Check if API key configured and config exists
        return jsonify({"error": "AI SDK not configured."}), 503

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    prompt = data.get('prompt')
    complexity = data.get('complexity', 5)
    colorUsage = data.get('colorUsage', 5)
    selected_model_name = data.get('model', 'gemini-2.5-pro-exp-03-25') # Get selected model, default

    if not prompt:
        return jsonify({"error": "Missing 'prompt' in request"}), 400

    try:
        # Format the prompt using the utility function
        full_prompt = format_svg_prompt(prompt, complexity=complexity, colorUsage=colorUsage)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400 # Prompt format error

    try:
        # Initialize the model dynamically based on selection
        try:
            dynamic_model = genai.GenerativeModel(selected_model_name)
        except Exception as model_init_error:
            print(f"Error initializing model '{selected_model_name}': {model_init_error}")
            return jsonify({"error": f"Failed to initialize selected AI model: {selected_model_name}"}), 500

        # Make the API call using the dynamic model and global config
        response = dynamic_model.generate_content(
            full_prompt,
            generation_config=generation_config
        )

        # Check response and clean it using the helper function (R1)
        if hasattr(response, 'text') and response.text:
            cleaned_svg = _clean_svg_response(response.text)
            if cleaned_svg:
                return jsonify({"svg_code": cleaned_svg})
            else:
                # Cleaning failed, return specific error
                return jsonify({"error": "Failed to extract valid SVG code from AI response."}), 500
        else:
            # Handle cases where the response might be blocked or empty
            error_message = "AI generation failed. Response was empty or blocked."
            # Add specific feedback if available (check Gemini API documentation for details)
            # if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
            #    error_message += f" Reason: {response.prompt_feedback}"
            print(error_message)
            return jsonify({"error": error_message}), 500

    except Exception as e: # Catch potential errors during generation
        print(f"Error during AI generation: {e}")
        return jsonify({"error": "An internal error occurred during SVG generation."}), 500

# --- New Extractor Endpoints (MVP Placeholders) ---

@app.route('/analyze_image', methods=['POST'])
def analyze_image():
    if not api_key:
        return jsonify({"error": "API key not configured"}), 500

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    image_data_url = data.get('image_data')
    context_prompt = data.get('context_prompt', '') # Renamed for clarity
    model_name = data.get('model', 'gemini-2.0-flash')

    if not image_data_url:
        return jsonify({"error": "No image data provided"}), 400

    try:
        # Decode image
        header, encoded = image_data_url.split(",", 1)
        image_data = base64.b64decode(encoded)
        image = Image.open(BytesIO(image_data))

        # --- Gemini API Call using prompt_utils ---
        model = genai.GenerativeModel(model_name)
        prompt_parts = format_analysis_prompt(context_prompt, image) # Use the new function

        response = model.generate_content(prompt_parts)
        analysis_text = response.text

        # --- Log Raw API Response --- 
        print("--- Raw Gemini API Response ---")
        print(analysis_text)
        print("-------------------------------")

        # --- Parse the response (Updated Section Names & Order) ---
        sections = {
            "metadata": "Metadata analysis not found.",
            "semantic": "Semantic analysis not found.", # New key
            "layout": "Layout analysis not found.",
            "content_styling": "Content & Styling analysis not found.",
            "ocr": "OCR analysis not found."
            # Removed svg_summary key
        }

        # Use regex (adjusting for new section names and order)
        metadata_match = re.search(r"\*\*Metadata Analysis:\*\*(.*?)(?=\*\*Semantic Analysis:\*\*|\Z)", analysis_text, re.DOTALL | re.IGNORECASE)
        semantic_match = re.search(r"\*\*Semantic Analysis:\*\*(.*?)(?=\*\*Layout Analysis:\*\*|\Z)", analysis_text, re.DOTALL | re.IGNORECASE)
        layout_match = re.search(r"\*\*Layout Analysis:\*\*(.*?)(?=\*\*Content & Styling Analysis:\*\*|\Z)", analysis_text, re.DOTALL | re.IGNORECASE)
        content_styling_match = re.search(r"\*\*Content & Styling Analysis:\*\*(.*?)(?=\*\*OCR Analysis:\*\*|\Z)", analysis_text, re.DOTALL | re.IGNORECASE)
        ocr_match = re.search(r"\*\*OCR Analysis:\*\*(.*?)\Z", analysis_text, re.DOTALL | re.IGNORECASE) # OCR is now last

        if metadata_match:
            sections["metadata"] = metadata_match.group(1).strip()
        if semantic_match:
            sections["semantic"] = semantic_match.group(1).strip()
        if layout_match:
            sections["layout"] = layout_match.group(1).strip()
        if content_styling_match:
            sections["content_styling"] = content_styling_match.group(1).strip()
        if ocr_match:
            sections["ocr"] = ocr_match.group(1).strip()
            if not sections["ocr"]: 
                 sections["ocr"] = "No text detected."
        # Removed svg_summary check

        # --- Log Parsed Sections --- 
        print("--- Parsed Sections Dictionary ---")
        print(sections)
        print("---------------------------------")

        return jsonify(sections)

    except Exception as e:
        print(f"Error during image analysis: {e}") # Log the error
        # Check for specific Gemini API errors if possible/needed
        # Example: hasattr(e, 'message')
        error_message = f"An error occurred during analysis: {str(e)}"
        # Avoid sending overly technical details to the frontend if it's a server issue
        if "API key" in str(e):
             error_message = "API key validation failed. Please check server configuration."
        elif isinstance(e, genai.types.generation_types.BlockedPromptException):
             error_message = "Analysis request was blocked due to safety concerns."
        elif isinstance(e, genai.types.generation_types.StopCandidateException):
             error_message = "Analysis stopped unexpectedly. The image might be unsuitable or the request too complex."

        return jsonify({"error": error_message}), 500

@app.route('/convert_to_svg', methods=['POST'])
def convert_to_svg():
    """Handles SVG recreation requests using image + analysis data."""
    if not api_key: # Use the globally configured api_key
        return jsonify({"error": "API key not configured"}), 500
    # Ensure generation_config is available (for temperature etc.)
    if not generation_config:
        return jsonify({"error": "Generation config not set."}), 503

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    image_data_url = data.get('image_data') # Renamed for consistency
    analysis_data = data.get('analysis_data') # Expecting dict with the 5 analysis texts
    # Update default model here
    selected_model_name = data.get('model', 'gemini-2.5-flash-preview-04-17') # New Default
    
    if not image_data_url or not analysis_data:
        return jsonify({"error": "Missing 'image_data' or 'analysis_data' in request"}), 400

    # Validate analysis_data structure (optional but good practice)
    required_keys = ['metadata', 'semantic', 'layout', 'content_styling', 'ocr']
    if not all(key in analysis_data for key in required_keys):
        return jsonify({"error": "Incomplete 'analysis_data' provided."}), 400

    print(f"Received SVG recreation request for model: {selected_model_name}")

    try:
        # 1. Decode Image
        header, encoded = image_data_url.split(",", 1)
        image_data = base64.b64decode(encoded)
        image = Image.open(BytesIO(image_data))

        # 2. Construct Prompt
        prompt_parts = [
            "You are an expert SVG generator. Your task is to recreate the provided image as accurately as possible in SVG format, paying close attention to text content, formatting, and layout, using the provided analysis as a guide.",
            "\n\n**Input Image:**",
            image,
            "\n\n**Image Analysis Results (Use this information heavily to guide the recreation):**",

            "\n\n--- METADATA ANALYSIS ---",
            analysis_data.get('metadata', 'N/A'),

            "\n\n--- SEMANTIC ANALYSIS --- (Purpose/Meaning)",
            analysis_data.get('semantic', 'N/A'),

            "\n\n--- LAYOUT ANALYSIS --- (Structure/Placement)",
            analysis_data.get('layout', 'N/A'),

            "\n\n--- CONTENT & STYLING ANALYSIS --- (Text Content/Visuals)",
            analysis_data.get('content_styling', 'N/A'),

            "\n\n--- OCR ANALYSIS --- (Detailed Text/Structure)",
            analysis_data.get('ocr', 'N/A'),

            "\n\n**SVG Generation Instructions:**",
            "1. Recreate the visual structure, element placement, shapes, colors, and styling based *primarily* on the image, using the analysis sections to clarify details and ensure accuracy.",
            "2. **CRITICAL:** Accurately reproduce ALL text content identified in the OCR Analysis. Preserve its formatting (bold, italic), alignment, size, and relative positioning as described in the analysis. Use appropriate `<text>` elements with relevant attributes (`x`, `y`, `font-family`, `font-size`, `font-weight`, `font-style`, `fill`, `text-anchor`).",
            "3. Use standard SVG elements (`<rect>`, `<circle>`, `<path>`, `<line>`, `<text>`, `<g>`, etc.).",
            "4. The root `<svg>` element MUST include `xmlns=\"http://www.w3.org/2000/svg\"` and a relevant `viewBox` (estimate based on analysis or image aspect ratio, e.g., `viewBox=\"0 0 width height\"`).",
            "5. Pay attention to layering (e.g., text should generally be on top of background shapes). Use `<g>` elements for grouping where logical.",
            "6. Prioritize visual accuracy and clean, standard SVG code. Use presentation attributes (e.g., `fill`, `stroke`) over inline `style` attributes unless necessary.",
            "7. Output ONLY the raw SVG code, starting strictly with `<svg` and ending strictly with `</svg>`. No markdown fences, no XML declaration, no comments, no other text.",
        ]

        # 3. Initialize Model and Generate
        try:
            model = genai.GenerativeModel(selected_model_name)
        except Exception as model_init_error:
            print(f"Error initializing model '{selected_model_name}': {model_init_error}")
            return jsonify({"error": f"Failed to initialize selected AI model: {selected_model_name}"}), 500

        response = model.generate_content(
            prompt_parts,
            generation_config=generation_config # Use the global config
        )

        # 4. Process Response
        if hasattr(response, 'text') and response.text:
            cleaned_svg = _clean_svg_response(response.text)
            if cleaned_svg:
                return jsonify({"svg_code": cleaned_svg})
            else:
                # Cleaning failed
                 print(f"Recreation cleaning failed. Raw response:\n{response.text}")
                 return jsonify({"error": "Failed to extract valid SVG code from AI response."}), 500
        else:
            # Handle blocked or empty response
            error_message = "AI generation failed during SVG recreation. Response was empty or blocked."
            print(error_message)
            # Consider adding more specific feedback if the API provides it
            return jsonify({"error": error_message}), 500

    except Exception as e:
        print(f"Error during SVG recreation: {e}")
        # Add more specific error checking if needed (like for API key errors during this call)
        return jsonify({"error": "An internal error occurred during SVG recreation."}), 500

@app.route('/refine_svg', methods=['POST'])
def refine_svg():
    """Handles SVG refinement requests."""
    if not api_key:
        return jsonify({"error": "API key not configured"}), 500
    if not generation_config:
        return jsonify({"error": "Generation config not set."}), 503
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    original_svg_code = data.get('svg_code')
    refinement_prompt = data.get('refinement_prompt', '') # Default to empty string
    png_data_url = data.get('png_data') # Get optional PNG data URL
    # Update default model here
    selected_model_name = data.get('model', 'gemini-2.5-flash-preview-04-17') # New Default

    if not original_svg_code:
        return jsonify({"error": "Missing 'svg_code' in request"}), 400
    # refinement_prompt is now optional

    print(f"Received SVG refinement request for model: {selected_model_name}")
    if png_data_url:
        print("PNG data included for self-critique.")

    try:
        prompt_parts = [
            f"You are an expert SVG editor performing a refinement task. "
            f"You will analyze the provided original SVG code, its rendered appearance (shown in the PNG image), and optional user refinement instructions. "
            f"Your goal is to improve the SVG based on both the user's feedback AND your own expert critique of the rendered PNG compared to common SVG best practices or the likely original intent."
        ]

        # --- Include Original SVG --- 
        prompt_parts.extend([
            f"\n\n**Original SVG Code:**\n```svg\n{original_svg_code}\n```\n"
        ])

        # --- Include Rendered PNG --- 
        png_image = None
        if png_data_url:
            try:
                header, encoded = png_data_url.split(",", 1)
                png_data = base64.b64decode(encoded)
                png_image = Image.open(BytesIO(png_data))
                prompt_parts.extend([
                    "\n\n**Rendered PNG of Original SVG:**",
                    png_image,
                    "(This image shows how the 'Original SVG Code' above currently renders.)"
                ])
            except Exception as img_err:
                print(f"Warning: Failed to decode/load PNG data: {img_err}")
                prompt_parts.append("\n\n(Error loading rendered PNG preview)")

        # --- Include User Refinement Prompt --- 
        prompt_parts.extend([
            f"\n\n**User's Explicit Refinement Instructions:**\n{refinement_prompt if refinement_prompt else 'None provided.'}\n"
        ])

        # --- Include Detailed Instructions --- 
        prompt_parts.extend([
            f"\n\n**IMPORTANT Instructions for Refinement & Self-Correction:**\n",
            f"1. **Analyze PNG vs SVG:** Compare the rendered PNG image to the Original SVG Code. Identify any discrepancies, rendering issues, or areas where the SVG deviates from expected visual quality (e.g., incorrect layering, alignment, text formatting, missing elements, unintended artifacts).",
            f"2. **Self-Critique:** Based on your analysis in step 1, determine necessary corrections even if the user didn't mention them. Prioritize fixing obvious errors or significant visual deviations.",
            f"3. **Apply User Feedback:** If the user provided explicit instructions, address them precisely.",
            f"4. **Combine & Prioritize:** Integrate your self-corrections (from step 2) with the user's requested changes (from step 3). If there's a conflict, generally prioritize fixing rendering errors/major quality issues first, then apply user cosmetic requests.",
            f"5. **Minimal Changes:** Apply only the necessary changes. Do NOT add unrelated elements or completely redesign.",
            f"6. **Preserve Structure:** Maintain existing SVG structure (groups, IDs, classes) unless modification is essential for the fix.",
            f"7. **Validity & Format:** Ensure the output is valid SVG code starting strictly with `<svg` and ending strictly with `</svg>`. No markdown, XML declaration, comments, or explanations."
        ])

        # 2. Initialize Model and Generate
        try:
            model = genai.GenerativeModel(selected_model_name)
        except Exception as model_init_error:
            print(f"Error initializing model '{selected_model_name}': {model_init_error}")
            return jsonify({"error": f"Failed to initialize selected AI model: {selected_model_name}"}), 500

        response = model.generate_content(
            prompt_parts, # Send the list of parts
            generation_config=generation_config
        )

        # 3. Process Response
        if hasattr(response, 'text') and response.text:
            cleaned_svg = _clean_svg_response(response.text)
            if cleaned_svg:
                return jsonify({"svg_code": cleaned_svg})
            else:
                print(f"Refinement cleaning failed. Raw response:\n{response.text}")
                return jsonify({"error": "Failed to extract valid SVG code from refinement response."}), 500
        else:
            error_message = "AI generation failed during SVG refinement. Response was empty or blocked."
            print(error_message)
            return jsonify({"error": error_message}), 500

    except Exception as e:
        print(f"Error during SVG refinement: {e}")
        return jsonify({"error": "An internal error occurred during SVG refinement."}), 500

# --- Run the App ---

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 