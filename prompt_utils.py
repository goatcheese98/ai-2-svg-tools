from typing import List, Union
from PIL.Image import Image # Assuming Image is from PIL

def format_svg_prompt(user_prompt: str, complexity: int | None = None, colorUsage: int | None = None) -> str:
    """Formats the user prompt with hints based on sliders and structural instructions.

    Args:
        user_prompt: The raw description provided by the user.
        complexity: An integer from 1 (simple) to 10 (complex). Default is 5. Higher values indicate a preference for more complex designs and more SVG elements.
        colorUsage: An integer from 1 (limited) to 10 (diverse). Default is 5. Higher values indicate a preference for more diverse color usage.

    Returns:
        The fully formatted prompt string for the AI model.
    """
    if not isinstance(user_prompt, str) or not user_prompt.strip():
        raise ValueError("User prompt cannot be empty.")

    # --- Persona Prompt --- 
    persona = (
        "You are an expert graphic designer specializing in modern vector graphics and SVG creation. "
        "You have a keen eye for aesthetics, color theory, clean design principles, and efficient SVG code. "
        "Your goal is to translate the user's description into a high-quality, visually appealing, and technically sound SVG file."
    )
    
    # --- Slider Hints --- 
    hints = []
    if complexity is not None:
        if not 1 <= complexity <= 6:
            complexity = 3 # Default to mid if value is out of range
        if complexity <= 2:
            hints.append("Keep the shapes and structure very simple (low complexity).")
        elif complexity >= 5:
            hints.append("Incorporate intricate details, potentially multiple overlapping elements or complex paths (high complexity).")
        else: # complexity is 3 or 4
            hints.append("Aim for moderate complexity.")
    
    if colorUsage is not None:
        if not 1 <= colorUsage <= 6:
            colorUsage = 3 # Default to mid if value is out of range
        if colorUsage <= 2:
            hints.append("Use a very limited color palette, possibly monochrome or just 2-3 colors (low color usage).")
        elif colorUsage >= 5:
            hints.append("Feel free to use a rich and diverse color palette (high color usage).")
        else: # colorUsage is 3 or 4
            hints.append("Use a balanced number of colors (moderate color usage).")

    hints_string = " Design Hints: " + " ".join(hints) if hints else ""

    # --- Core Task & Output Format --- 
    core_task = (
        f"\n\nUser Request: \"{user_prompt}\"{hints_string}\n\n"
        f"Instructions:\n"
        f"1. Generate ONLY the raw SVG code based on the User Request and Design Hints.\n"
        f"2. The root `<svg>` element MUST include `xmlns=\"http://www.w3.org/2000/svg\"` and an appropriate `viewBox`. Estimate the viewBox based on the described elements (e.g., `viewBox=\"0 0 100 100\"` for simple centered shapes). \n"
        f"3. Use standard SVG elements (`<rect>`, `<circle>`, `<path>`, `<text>`, `<g>`, etc.).\n"
        f"4. Apply colors, strokes, and fills as described or implied. Use presentation attributes (e.g., `fill`, `stroke`) over inline `style` attributes where possible.\n"
        f"5. Ensure the output starts strictly with `<svg` and ends strictly with `</svg>`. No markdown fences, no XML declaration, no explanations, no other text."
    )

    formatted_prompt = persona + core_task
    
    return formatted_prompt 

def format_analysis_prompt(user_context: str, image: Image) -> List[Union[str, Image]]:
    """Formats the prompt for image analysis, requesting structured output."""

    prompt_parts = [
        "Analyze the following image to gather information for recreating it as an SVG.",
        "User context/request for the final SVG: ", user_context if user_context else "None provided", "\n\n",
        "Provide a structured analysis with the following sections clearly marked using Markdown headers (e.g., **Section Name:**) IN THIS EXACT ORDER: Metadata Analysis, Semantic Analysis, Layout Analysis, Content & Styling Analysis, OCR Analysis.",
        
        "\n\n**Metadata Analysis:**",
        "  - Dimensions: Estimated width/height in pixels.",
        "  - Aspect Ratio: Calculated width:height.",
        "  - Key Colors: List primary, secondary, and background hex codes.",
        "  - Fonts: Identify font families, styles (bold, italic), and relative sizes if possible.",

        "\n\n**Semantic Analysis:**", # Renamed and refocused
        "  - Describe the overall purpose and meaning of the image.",
        "  - Identify the main subject, key objects, or concepts presented.",
        "  - What is the core message or information being conveyed?",

        "\n\n**Layout Analysis:**",
        "  - Overall Structure: Describe the main layout areas (header, body, sidebar, footer?).",
        "  - Element Positioning: Describe the placement of key elements (images, text blocks, shapes) using relative terms (top-left, center, bottom-right).",
        "  - Alignment: How are elements aligned relative to each other or the page (left, center, right)?",
        "  - Spacing: Describe the relative spacing or padding between major elements.",
        "  - Shapes: Identify main shapes (rectangles, circles, lines) and their approximate location and size.",

        "\n\n**Content & Styling Analysis:**", 
        "  - Text Content: Transcribe all significant text, preserving line breaks and general formatting as seen.",
        "  - Visual Style: Describe the overall aesthetic (e.g., flat, minimalist, illustrative, realistic).",
        "  - Color Palette Usage: How are the key colors used across elements?",
        "  - Borders/Lines: Describe any significant borders or lines, including thickness and style (solid, dashed).",
        "  - Effects: Mention any shadows, gradients, or other visual effects.",

         "\n\n**OCR Analysis:**", # Enhanced based on user feedback
        "  - Identify any tables or structured charts first. If found:",
        "  - Describe the structure (rows, columns).",
        "  - Extract header text.",
        "  - Note any merged cells or special cell alignments.",
        "Provide cell content of the table if present, maintaining row/column relationships (e.g., using a simple markdown table or list format. NEVER indent the cell/table content.).",
        "  - For all other text:",
        "  - Transcribe text content sequentially (top-to-bottom, left-to-right).",
        "  - Group text belonging to the same visual container (e.g., a specific box, paragraph). Number these containers.",
        "  - For each text container, describe its approximate relative position (e.g., top-left, middle, bottom-right).",
        "  - Describe the text alignment within its container (left, center, right, justified?).",
        "  - If no text is found, state 'No text detected'.",
        

        "\n\n", # Separator before image
        image
    ]
    return prompt_parts 