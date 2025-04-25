## Product Requirements Document: AI SVG Generator & Editor

**1. Introduction**

This document outlines the requirements for a single-page web application that allows users to generate Scalable Vector Graphics (SVG) code using an AI model based on a text prompt, preview the generated SVG as an image, edit the code directly, and see the preview update in real-time.

**2. Goals**

*   Provide a simple and intuitive interface for generating SVG images from text descriptions using AI.
*   Enable users to view and directly edit the generated SVG code.
*   Offer a live preview of the SVG image that updates as the code is edited.
*   Allow users to save their final SVG code.

**3. Features**

*   **Prompt Input:**
    *   A text input field where users can enter their description or prompt for the desired SVG image.
    *   A "Generate" button to trigger the AI generation process.
*   **AI SVG Generation:**
    *   Backend integration with a generative AI model (`gemini-pro`).
    *   The AI model will take the user's prompt and generate SVG code as output.
    *   The backend will attempt to clean the AI response, removing potential markdown formatting (like ` ```svg ` or ` ```xml `) to extract only the valid SVG code.
    *   Display loading/processing state while waiting for the AI response.
*   **SVG Code Editor:**
    *   A text area or code editor component displaying the generated SVG code.
    *   Users can freely edit the content within this editor.
    *   Syntax highlighting for SVG/XML is desirable but optional for the first version.
*   **SVG Image Preview:**
    *   A designated area on the page to render the SVG image based on the current code in the editor.
    *   The preview should update automatically whenever the code in the editor changes.
*   **Real-time Preview Update:**
    *   As the user types or modifies the code in the SVG editor, the adjacent image preview should update near instantly to reflect the changes. Debouncing might be used to optimize performance.
*   **Save/Download SVG:**
    *   A "Save" or "Download" button that allows the user to save the current content of the SVG code editor as a `.svg` file on their local machine.

**4. Technical Stack**

*   **Backend:** Python (v3.12), Flask framework. Responsible for handling user requests, interfacing with the AI model API, and serving the frontend.
*   **Frontend:** HTML, CSS, minimal Vanilla JavaScript. Responsible for the user interface, handling user input, displaying the code editor and image preview, and managing the real-time updates.
*   **AI Model:** Google Gemini model (e.g., `gemini-2.0-flash`) accessed via its API. The specific model might need adjustment based on availability and suitability for SVG generation. *Note: "gemini-2.0-flash" was specified, NEVER choose or update to a differet model than the ones specified.*
*   **Environment:** A Python virtual environment (`venv`) will be used for managing dependencies.

**5. User Interface (UI) / User Experience (UX)**

*   **Layout:** A simple, clean, single-page layout. Likely a two-column or top/bottom arrangement:
    *   One area for prompt input and controls (Generate, Save buttons).
    *   One area for the SVG code editor.
    *   One area for the rendered SVG image preview.
*   **Workflow:**
    1.  User enters a prompt (e.g., "a red circle with a blue border").
    2.  User clicks "Generate".
    3.  Application shows a loading indicator.
    4.  Backend sends the prompt to the AI API.
    5.  AI returns SVG code.
    6.  Backend sends the SVG code to the frontend.
    7.  Frontend displays the code in the editor and renders the initial image in the preview area.
    8.  User edits the code in the editor.
    9.  As the user edits, the preview area updates automatically.
    10. User clicks "Save".
    11. Browser prompts the user to download the current code as an `.svg` file.

**6. Non-Functional Requirements**

*   **Usability:** The interface should be intuitive and require minimal instruction.
*   **Performance:** Real-time preview updates should be responsive. AI generation time depends on the model and API response time.
*   **Reliability:** Handle API errors and invalid SVG code gracefully (e.g., show an error in the preview area if the SVG is malformed or cannot be extracted from the AI response).

**7. Future Enhancements (Optional)**

*   Support for different AI models.
*   More advanced code editor features (syntax highlighting, line numbers, auto-completion).
*   Ability to load existing SVG files.
*   User accounts and saving SVGs to the cloud.
*   Sharing generated SVGs.
*   More sophisticated error handling for invalid SVG. 