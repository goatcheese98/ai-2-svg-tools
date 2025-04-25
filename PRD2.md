## Product Requirements Document: Content Extractor Feature (PRD2)

**1. Introduction**

This document outlines the requirements for a new feature, "Content Extractor," to be added as a primary view alongside the existing "AI SVG Generator" within the application. Users will navigate between these two features using top-level tabs. The "Content Extractor" will allow users to upload an image, optionally provide context, trigger an AI-powered multi-faceted analysis, review/edit this analysis, and finally instruct the AI to generate an SVG representation based on the image and analysis data, reusing the application's existing SVG output components.

**2. Goals**

*   Enable users to extract structured, descriptive information from uploaded images using AI.
*   Provide insights into image meaning, structure, style, and text content.
*   Allow users to refine the AI's analysis for accuracy.
*   Leverage the extracted/refined information and the original image to generate a corresponding SVG representation using AI.
*   Integrate this functionality smoothly via a clear tabbed interface.
*   Maintain visual consistency with the established application theme.
*   Reuse existing SVG output components (editor, preview, history) for efficiency and consistency.

**3. User Interface (UI) / User Experience (UX)**

*   **Tabbed Navigation:**
    *   A persistent header area will contain distinct tabs/buttons (e.g., "AI SVG Generator", "Content Extractor") as shown in the wireframe.
    *   Clicking a tab will switch the main content area below it to display the corresponding feature's interface.
    *   The active tab will be visually highlighted.
*   **Visual Consistency:**
    *   The "Content Extractor" tab and its components will adhere strictly to the established dark theme (colors, gradients, fonts, button styles, etc.) used in the "AI SVG Generator" tab for a cohesive application feel.
*   **Content Extractor Tab Layout:**
    *   **(Input Area - Shown when 'Content Extractor' tab is active):**
        *   Image upload control (`<input type="file" accept="image/*">`).
        *   Image preview area.
        *   Optional context prompt text area (`#analysis-prompt`).
        *   "Analyze Image" button.
        *   Analysis status message area.
    *   **(Analysis Results Area - Appears below Input Area after analysis):**
        *   Five distinct, clearly labeled sections with editable `<textarea>` elements: Semantic Analysis, Metadata Analysis, Styling Analysis, Layout Analysis, Text Content (OCR).
    *   **(Conversion Control - Appears below Analysis Results):**
        *   "Convert to SVG" button.
        *   Conversion status message area.
    *   **(Shared Output Area - Below Conversion Control / Main part of 'AI SVG Generator' tab):**
        *   The *existing* `main-content` div (containing SVG Code Editor `#svg-code-editor` and Live Preview `#svg-preview`) will be populated when the "Convert to SVG" action completes successfully. This section is shared between tabs and updated by the active process.
        *   The *existing* `history-section` div is shared and visible, potentially below the main content area regardless of the active tab.

**4. Core Features**

*   **Tab Switching:** Client-side JavaScript will handle showing/hiding the appropriate content divs (`prompt-section`, `main-content`, `content-extractor-input-area`, `content-extractor-analysis-area`, etc.) when tabs are clicked.
*   **Image Upload & Preview:** User selects image; JS displays preview within the Content Extractor tab.
*   **Optional Context Prompt:** Guides image analysis.
*   **AI Image Analysis:** (As described previously - multimodal AI call via `/analyze_image`, results populate the 5 text areas).
*   **Analysis Editing:** Users modify the content of the 5 text areas.
*   **SVG Conversion from Image + Analysis:** (As described previously - multimodal AI call via `/convert_to_svg`, leveraging image + edited analysis text).
    *   The generated SVG code populates the *shared* `#svg-code-editor`.
    *   The generated SVG renders in the *shared* `#svg-preview`.
*   **Shared History:**
    *   Successful conversions from the "Content Extractor" tab are saved to the *same* `sessionStorage` history used by the "AI SVG Generator".
    *   History items should include metadata indicating their origin (e.g., `type: 'generator'`, `type: 'extractor'`) and relevant parameters (prompt, sliders for generator; analysis parameters/image context for extractor).
    *   The shared history list (`#history-list`) UI will display items from both sources, potentially using icons or text labels to differentiate. Loading a history item restores its associated state (prompt/sliders or image/analysis/SVG) and potentially switches to the relevant tab.
*   **Shared Output Actions:** The existing "Copy Code" and "Save SVG" buttons operate on the content currently displayed in the shared `#svg-code-editor`.

**5. Technical Considerations & Stack**

*   (As described previously - Multimodal AI, Flask backend, new endpoints, JS for UI logic/file handling, robust prompting, potential metadata validation).
*   **Frontend State Management:** Increased complexity in managing which UI sections are visible based on the active tab and the state within that tab (e.g., image uploaded, analysis done, SVG converted).

**6. Reused Components**

*   SVG Code Editor (`#svg-code-editor`)
*   Live Preview (`#svg-preview`)
*   Generation History section & `sessionStorage` logic (needs adaptation for different data types)
*   Copy Code Button (`#copy-btn`)
*   Save SVG Button (`#save-btn`)
*   Core CSS styling (variables, base styles)
*   Backend SVG cleaning function (`_clean_svg_response`)

**7. Non-Functional Requirements**

*   (As described previously - Performance, Reliability, Usability, now including clear tab navigation).

**8. Future Enhancements (Optional)**

*   (As described previously). 