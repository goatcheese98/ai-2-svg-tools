console.log("--- script.js loaded --- "); // LOG X

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- DOMContentLoaded fired --- "); // LOG Y

    // Tab Elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Generator Tab Elements
    const promptInput = document.getElementById('prompt');
    const generateBtn = document.getElementById('generate-btn');
    const svgCodeEditor = document.getElementById('svg-code-editor');
    const svgPreview = document.getElementById('svg-preview');
    const saveBtn = document.getElementById('save-btn');
    const copyBtn = document.getElementById('copy-btn');
    const statusMessage = document.getElementById('status-message');
    const historyList = document.getElementById('history-list'); // History list UL
    const clearHistoryBtn = document.getElementById('clear-history-btn'); // Clear history button
    const savePngBtn = document.getElementById('save-png-btn'); // New PNG save button reference
    const pngWidthInput = document.getElementById('png-width-input'); // PNG Width Input
    const pngHeightInput = document.getElementById('png-height-input'); // PNG Height Input
    const saveCustomPngBtn = document.getElementById('save-custom-png-btn'); // ADDED
    const generateSpinner = document.getElementById('generate-spinner'); // ADDED

    // Background Control Elements
    const backgroundControlButtons = document.querySelectorAll('.bg-control-btn');
    const customBgButton = document.getElementById('bg-custom-btn'); // New
    const customBgColorPicker = document.getElementById('bg-custom-color-picker'); // New
    const customBgHexDisplay = document.getElementById('bg-custom-hex'); // New

    // Button Group Controls
    const complexityButtons = document.querySelectorAll('#complexity-buttons .control-button');
    const colorUsageButtons = document.querySelectorAll('#color-usage-buttons .control-button');

    // Model Select
    const modelSelect = document.getElementById('model-select'); // Add reference

    // Extractor Tab Elements (MVP - Input Only)
    const imageUploadInput = document.getElementById('image-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const analysisPromptInput = document.getElementById('analysis-prompt');
    const analysisPromptContainer = analysisPromptInput.closest('.control-group'); // Get parent div
    const extractorModelSelect = document.getElementById('extractor-model-select'); 
    const extractorActionsContainer = document.querySelector('.extractor-actions'); // Get the actions container
    const analyzeBtn = document.getElementById('analyze-btn');
    const analysisStatus = document.getElementById('analysis-status');
    const analyzeSpinner = document.getElementById('analyze-spinner'); // ADDED
    const dropZone = document.getElementById('drop-zone'); // Add drop zone reference

    // Placeholders for future elements
    const analysisResultsSection = document.getElementById('analysis-results-section');
    const recreateSvgBtn = document.getElementById('recreate-svg-btn');
    const recreateSvgStatus = document.getElementById('recreate-svg-status');
    const recreateSpinner = document.getElementById('recreate-spinner'); // ADDED
    const copyMarkdownBtn = document.getElementById('copy-markdown-btn');
    const analysisButtonsContainer = document.querySelector('#analysis-results-section .analysis-actions'); // Ref the specific button container

    // Refinement Elements
    const refinementPromptInput = document.getElementById('refinement-prompt');
    const refineModelSelect = document.getElementById('refine-model-select'); // New Refine Model Select
    const refineBtn = document.getElementById('refine-btn');
    const refineStatus = document.getElementById('refine-status');
    const refineSpinner = document.getElementById('refine-spinner'); // ADDED

    // Shared Output & History Containers (for hiding/showing)
    const outputContainer = document.querySelector('.output-container'); // ADDED
    const historyContainer = document.querySelector('.history-container'); // ADDED

    // Store image data temporarily
    let currentImageDataUrl = null;

    let debounceTimer;
    const MAX_HISTORY_ITEMS = 15; // Limit the number of history items

    // --- Auto-Resize Textarea Function ---
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto'; // Temporarily shrink to get accurate scrollHeight
        textarea.style.height = (textarea.scrollHeight) + 'px'; // Set height based on content
    }

    // --- Tab Switching Logic ---
    function switchTab(targetTabId) {
        // Hide all content
        tabContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
        // Deactivate all buttons
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Activate target tab and content
        const targetContent = document.getElementById(targetTabId);
        const targetButton = document.querySelector(`.tab-button[data-tab="${targetTabId}"]`);

        if (targetContent) {
            targetContent.style.display = 'block';
            targetContent.classList.add('active');
        }
        if (targetButton) {
            targetButton.classList.add('active');
        }

        // --- ADDED: Show/Hide Shared Sections --- 
        if (targetTabId === 'how-to-use-tab-content') {
            if (outputContainer) outputContainer.style.display = 'none';
            if (historyContainer) historyContainer.style.display = 'none';
        } else {
            // Show for Generator or Extractor tabs
            if (outputContainer) outputContainer.style.display = 'block'; // Or 'flex' if it uses flex layout
            if (historyContainer) historyContainer.style.display = 'block';
        }
        // --- END ADDED SECTION --- 
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('data-tab');
            switchTab(targetTabId);
        });
    });

    // --- UI Helper Functions ---
    function _update_generation_ui(is_loading, message = null, is_error = false) {
        generateBtn.disabled = is_loading;
        
        // Toggle spinner visibility
        if (is_loading) {
            generateSpinner.classList.add('visible');
        } else {
            generateSpinner.classList.remove('visible');
        }

        if (message) {
            statusMessage.textContent = message;
            statusMessage.className = 'status'; // Reset class first
            if (is_error) {
                statusMessage.style.color = 'red';
            } else if (is_loading) {
                statusMessage.className = 'status info'; // Use info class for loading
                statusMessage.style.color = ''; // Rely on CSS for info
            } else {
                 // Success message
                 statusMessage.style.color = 'green';
            }
        } else {
            statusMessage.textContent = '';
            statusMessage.className = 'status';
            statusMessage.style.color = '';
        }

        // Clear message after a delay if it's not a loading message
        if (!is_loading) {
             setTimeout(() => {
                 // Only clear if it hasn't been replaced by another message
                 if (statusMessage.textContent === message) {
                     statusMessage.textContent = '';
                     statusMessage.className = 'status';
                     statusMessage.style.color = '';
                 }
            }, 5000);
        }
    }

    // Function to update SVG preview AND dependent button states
    function updatePreview(svgCode) {
        // Clear previous preview content
        svgPreview.innerHTML = '';
        const svgPresent = svgCode && svgCode.trim().length > 0;

        // Enable/disable SVG-dependent buttons
        copyBtn.disabled = !svgPresent;
        saveBtn.disabled = !svgPresent;
        savePngBtn.disabled = !svgPresent;
        
        // Update button styles based on state (optional but nice)
        [copyBtn, saveBtn, savePngBtn].forEach(btn => {
            if (!svgPresent) {
                btn.classList.remove('primary-btn');
                btn.classList.add('secondary-btn');
            } else {
                // Turn Save buttons orange when enabled
                if (btn !== copyBtn) { 
                    btn.classList.add('primary-btn');
                    btn.classList.remove('secondary-btn');
                }
            }
        });
        
        // Reset custom PNG button state when preview changes
        resetCustomPngButtonState();

        if (!svgPresent) {
            svgPreview.innerHTML = '<p style="color: #999;">Preview will appear here.</p>';
            return;
        }

        // Basic validation attempt (browser will do the heavy lifting)
        if (!svgCode.includes('<svg') || !svgCode.includes('</svg>')) {
             svgPreview.innerHTML = '<p style="color: red;">Invalid or incomplete SVG code.</p>';
             return;
        }

        // Use DOMParser to potentially catch some parsing errors and handle potentially unsafe content
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgCode, "image/svg+xml");
        const svgElement = doc.querySelector('svg');

        if (doc.querySelector('parsererror') || !svgElement) {
             svgPreview.innerHTML = '<p style="color: red;">Error parsing SVG code.</p>';
        } else {
            // Append the parsed and potentially sanitized SVG element
            // This is generally safer than setting innerHTML directly with arbitrary SVG
            svgPreview.appendChild(svgElement);
        }
    }

    // Get selected values from button groups
    function getSelectedButtonValue(buttons) {
        for (const button of buttons) {
            if (button.classList.contains('active')) {
                return parseInt(button.dataset.value, 10);
            }
        }
        return 3; // Default if none selected (shouldn't happen with default active)
    }

    // Function to handle generation request
    async function handleGenerate() {
        const currentPrompt = promptInput.value.trim();
        if (!currentPrompt) {
            _update_generation_ui(false, 'Please enter a prompt.', true);
            return;
        }

        const complexity = getSelectedButtonValue(complexityButtons);
        const colorUsage = getSelectedButtonValue(colorUsageButtons);
        const selectedModel = modelSelect.value;

        _update_generation_ui(true, 'Generating SVG...');
        svgCodeEditor.value = '';
        updatePreview('');

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: currentPrompt,
                    complexity: complexity,
                    colorUsage: colorUsage,
                    model: selectedModel
                }),
            });

            if (!response.ok) {
                let errorMsg = `Generation failed (status ${response.status})`;
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMsg = `Generation failed: ${errorData.error || JSON.stringify(errorData)}`;
                    } else {
                        const errorText = await response.text();
                        console.error("Non-JSON error response from /generate:", errorText);
                        errorMsg = `Generation failed: Server returned an unexpected response (status ${response.status}). Check console for details.`;
                    }
                } catch (parseError) {
                    console.error("Error processing the error response from /generate:", parseError);
                    errorMsg = `Generation failed: Could not process error response (status ${response.status}).`;
                }
                throw new Error(errorMsg); // Throw specific error
            }

            // If response.ok, it should be JSON
            const data = await response.json();

            if (data.svg_code) {
                svgCodeEditor.value = data.svg_code;
                updatePreview(data.svg_code);
                _update_generation_ui(false, 'SVG generated successfully!');
                saveHistoryItem(currentPrompt, complexity, colorUsage, selectedModel, data.svg_code);
            } else {
                // Handle defensively
                _update_generation_ui(false, 'Generation completed, but no SVG code received.', true);
            }

        } catch (error) {
            console.error('Generation failed:', error);
            _update_generation_ui(false, error.message || 'An unexpected error occurred during generation.', true);
            updatePreview(''); // Clear preview on error
        }
    }

    // Function to handle saving SVG
    function handleSave() {
        const svgCode = svgCodeEditor.value;
        if (!svgCode.trim()) {
            alert('Nothing to save. Generate or enter SVG code first.');
            return;
        }

        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Create a filename based on the prompt or default
        const promptText = promptInput.value.trim().substring(0, 30).replace(/[^a-z0-9]/gi, '_') || 'generated';
        a.download = `${promptText}_${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to handle copying SVG code
    function handleCopy() {
        const svgCode = svgCodeEditor.value;
        if (!svgCode.trim()) {
            // Optionally provide feedback if there's nothing to copy
            // alert('Nothing to copy.');
            return;
        }

        navigator.clipboard.writeText(svgCode).then(() => {
            // Success feedback (optional)
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied'); // Add class for styling
            setTimeout(() => {
                copyBtn.textContent = 'Copy Code';
                copyBtn.classList.remove('copied'); // Remove class
            }, 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy code: ', err);
            // Error feedback (optional)
            alert('Failed to copy code to clipboard.');
        });
    }

    // --- History Functions ---

    function getHistory() {
        const history = sessionStorage.getItem('svgGeneratorHistory');
        return history ? JSON.parse(history) : [];
    }

    function saveHistory(history) {
        sessionStorage.setItem('svgGeneratorHistory', JSON.stringify(history));
    }

    function saveHistoryItem(prompt, complexity, colorUsage, model, svgCode) {
        let currentHistory = JSON.parse(sessionStorage.getItem('svgGeneratorHistory') || '[]');

        // Function to check if core configuration is identical
        const isIdenticalConfig = (item, newItemConfig) => {
            return item.prompt === newItemConfig.prompt &&
                   item.complexity === newItemConfig.complexity &&
                   item.colorUsage === newItemConfig.colorUsage &&
                   item.model === newItemConfig.model;
        };

        // Determine version number
        const newItemConfig = { prompt, complexity, colorUsage, model };
        let version = 1;
        currentHistory.forEach(item => {
            if (isIdenticalConfig(item, newItemConfig)) {
                version = Math.max(version, (item.version || 0) + 1);
            }
        });


        const newItem = {
            prompt: prompt,
            complexity: complexity,
            colorUsage: colorUsage,
            model: model,
            version: version, // Store the calculated version
            timestamp: new Date().toLocaleString(),
            svgCode: svgCode
        };

        currentHistory.unshift(newItem); // Add to the beginning

        // Limit history size
        if (currentHistory.length > MAX_HISTORY_ITEMS) {
            currentHistory = currentHistory.slice(0, MAX_HISTORY_ITEMS);
        }

        sessionStorage.setItem('svgGeneratorHistory', JSON.stringify(currentHistory));
    }

    function updateHistoryList() {
        const historyList = document.getElementById('history-list');
        const currentHistory = JSON.parse(sessionStorage.getItem('svgGeneratorHistory') || '[]');

        historyList.innerHTML = ''; // Clear existing list

        currentHistory.forEach((item, index) => {
            const li = document.createElement('li');

            // --- UPDATE: Display 1-6 values in history --- 
            const versionString = item.version ? ` (v${item.version})` : ''; // Add version if it exists
            const parametersString = `(Cmplx:${item.complexity}, Clr:${item.colorUsage}, M:${item.model || 'Default'})`; // Use short labels
            const timestampString = new Date(item.timestamp).toLocaleString(); // Ensure consistent formatting

            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt-snippet';
            promptSpan.textContent = `${item.prompt}${versionString} ${parametersString}`;
            li.appendChild(promptSpan);

            const timestampSpan = document.createElement('span');
            timestampSpan.className = 'timestamp';
            timestampSpan.textContent = timestampString;
            li.appendChild(timestampSpan);


            li.dataset.index = index; // Store index for retrieval
            li.addEventListener('click', () => {
                loadHistoryItem(index);
            });
            historyList.appendChild(li);
        });
    }

    function loadHistoryItem(index) {
        const currentHistory = JSON.parse(sessionStorage.getItem('svgGeneratorHistory') || '[]');
        if (index >= 0 && index < currentHistory.length) {
            const item = currentHistory[index];
            // Update generator controls
            promptInput.value = item.prompt;

            // --- UPDATE: Set active buttons based on history --- 
            setActiveButton(complexityButtons, item.complexity);
            setActiveButton(colorUsageButtons, item.colorUsage);

            // Remove slider updates
            // complexitySlider.value = item.complexity;
            // colorSlider.value = item.colorUsage;
            // complexityValueSpan.textContent = item.complexity;
            // colorValueSpan.textContent = item.colorUsage;
            if (modelSelect && item.model) modelSelect.value = item.model; // Update model dropdown

            // Update SVG output
            svgCodeEditor.value = item.svgCode;
            updatePreview(item.svgCode);

            // Switch to Generator tab if not already active
            switchTab('generator-tab-content');
        }
    }

    function clearHistory() {
        if (confirm('Are you sure you want to clear the generation history for this session?')) {
            sessionStorage.removeItem('svgGeneratorHistory');
            updateHistoryList();
        }
    }

    // --- Button Group Logic ---
    function handleButtonClick(event, buttons) {
        // Remove active class from all buttons in the group
        buttons.forEach(btn => btn.classList.remove('active'));
        // Add active class to the clicked button
        event.target.classList.add('active');
    }

    complexityButtons.forEach(button => {
        button.addEventListener('click', (e) => handleButtonClick(e, complexityButtons));
    });

    colorUsageButtons.forEach(button => {
        button.addEventListener('click', (e) => handleButtonClick(e, colorUsageButtons));
    });

    // Helper to set active button based on value
    function setActiveButton(buttons, value) {
        let targetValue;
        if (value <= 2) {
            targetValue = 1; // Activate 'Low' button (value=1)
        } else if (value <= 4) {
            targetValue = 3; // Activate 'Medium' button (value=3)
        } else {
            targetValue = 5; // Activate 'High' button (value=5)
        }

        buttons.forEach(btn => {
            if (parseInt(btn.dataset.value, 10) === targetValue) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    // --- End Button Group Logic ---

    // --- Background Control Logic ---
    backgroundControlButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all buttons first
            backgroundControlButtons.forEach(btn => btn.classList.remove('active'));
            // Activate the clicked button
            button.classList.add('active');

            const bgType = button.getAttribute('data-bg');
            console.log(`Background button clicked: ID=${button.id}, Type=${bgType}, Active=${button.classList.contains('active')}`); // DEBUG LOG
            
            // Explicitly hide custom elements initially
            customBgColorPicker.style.display = 'none';
            customBgHexDisplay.style.display = 'none';
            
            // Apply background based on type
            if (bgType === 'transparent') {
                svgPreview.classList.remove('bg-white', 'bg-black');
                svgPreview.classList.add('bg-transparent');
                svgPreview.style.backgroundColor = ''; // Remove inline style
            } else if (bgType === 'white') {
                svgPreview.classList.remove('bg-transparent', 'bg-black');
                svgPreview.classList.add('bg-white');
                svgPreview.style.backgroundColor = ''; // Remove inline style
            } else if (bgType === 'black') {
                svgPreview.classList.remove('bg-transparent', 'bg-white');
                svgPreview.classList.add('bg-black');
                svgPreview.style.backgroundColor = ''; // Remove inline style
            } else if (bgType === 'custom') {
                // Show the custom elements
                customBgColorPicker.style.display = 'inline-block';
                customBgHexDisplay.style.display = 'inline-block';
                
                // Apply the *current* color picker value when Custom is selected (RE-ENABLED to set initial state)
                const currentColor = customBgColorPicker.value; 
                svgPreview.classList.remove('bg-transparent', 'bg-white', 'bg-black');
                svgPreview.style.backgroundColor = currentColor; 
                customBgHexDisplay.textContent = customBgColorPicker.value; 
            }
            
            // Hide/Show custom picker elements (CSS handles this now based on .active class)
            // The JS only needs to set the .active class correctly
        });
    });

    // Custom Background Color Picker Input
    customBgColorPicker.addEventListener('input', () => {
        const newColor = customBgColorPicker.value;
        console.log(`Color picker input: NewColor=${newColor}, IsCustomActive=${customBgButton.classList.contains('active')}`); // DEBUG LOG
        customBgHexDisplay.textContent = newColor;
        // Only apply if the custom button is actually active (this check remains correct)
        if (customBgButton.classList.contains('active')) {
            svgPreview.style.backgroundColor = newColor;
            svgPreview.classList.remove('bg-transparent', 'bg-white', 'bg-black'); // Ensure no classes interfere
        }
    });

    // Function to apply persisted background preference on load
    function applyPersistedBackground() {
        const persistedBg = localStorage.getItem('previewBackground') || 'transparent'; // Default to transparent
        svgPreview.classList.remove('bg-transparent', 'bg-white', 'bg-black');
        svgPreview.classList.add(`bg-${persistedBg}`);

        // Update active button state
        backgroundControlButtons.forEach(btn => {
            if (btn.dataset.bg === persistedBg) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Call this function after the DOM is fully loaded
    applyPersistedBackground();
    // --- End Background Control Logic ---

    // Event Listeners
    generateBtn.addEventListener('click', handleGenerate);

    // Update preview and related buttons on code editor input 
    svgCodeEditor.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            updatePreview(svgCodeEditor.value); // Update preview + buttons
            updateCustomPngButtonState(); // Also check custom PNG button state
        }, 300);
    });

    // Check custom PNG button state when dimension inputs change
    if (pngWidthInput) pngWidthInput.addEventListener('input', updateCustomPngButtonState);
    if (pngHeightInput) pngHeightInput.addEventListener('input', updateCustomPngButtonState);

    // Save SVG button listener (already exists, state handled by updatePreview)
    saveBtn.addEventListener('click', handleSave);

    // Copy code button listener (already exists, state handled by updatePreview)
    copyBtn.addEventListener('click', handleCopy);
    
    // History listeners (already exist)
    clearHistoryBtn.addEventListener('click', clearHistory);

    // PNG Button Listeners (updated earlier to pass flags)
    if (saveCustomPngBtn) {
        saveCustomPngBtn.addEventListener('click', (e) => handleSavePng(e, true)); // Pass true
    }
    if (savePngBtn) {
        savePngBtn.addEventListener('click', (e) => handleSavePng(e, false)); // Pass false
    }

    // --- Extractor Tab Functions (MVP - Image Preview Only) ---
    function handleFileSelect(file) {
        if (file && file.type.startsWith('image/')) {
            fileNameDisplay.textContent = file.name;
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
                // Store base64 data URL when image is loaded
                currentImageDataUrl = e.target.result;
                // Hide analysis results when new image is loaded
                if (analysisResultsSection) analysisResultsSection.style.display = 'none';
                // Clear previous analysis status
                analysisStatus.textContent = '';
            }
            reader.onerror = function(err) {
                console.error("FileReader error:", err);
                alert("Error reading file.");
                currentImageDataUrl = null;
            }
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = 'Invalid file type chosen';
            imagePreview.src = '#';
            imagePreviewContainer.style.display = 'none';
            currentImageDataUrl = null;
            alert('Please select an image file (e.g., JPG, PNG, GIF).');
        }
    }

    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                handleFileSelect(file);
            }
        });
    }

    // Drag and Drop Listeners
    if (dropZone) {
        dropZone.addEventListener('dragover', (event) => {
            event.stopPropagation();
            event.preventDefault(); // Necessary to allow drop
            // Add visual feedback
            dropZone.classList.add('dragover');
            event.dataTransfer.dropEffect = 'copy'; // Show browser indication
        });

        dropZone.addEventListener('dragleave', (event) => {
            event.stopPropagation();
            event.preventDefault();
            // Remove visual feedback
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (event) => {
            event.stopPropagation();
            event.preventDefault();
            // Remove visual feedback
            dropZone.classList.remove('dragover');

            const files = event.dataTransfer.files;
            if (files.length > 0) {
                // Process the first dropped file
                handleFileSelect(files[0]);
                 // Update the hidden file input's files property (optional but can be good practice)
                 // This allows submitting via a form if needed later, though we use fetch
                 try {
                     imageUploadInput.files = files;
                 } catch (err) {
                     console.warn("Could not directly set files on input element:", err);
                 }
            }
        });
    }

    // --- Update Analyze Button Listener ---
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            if (!currentImageDataUrl) {
                analysisStatus.textContent = 'Please upload an image first.';
                analysisStatus.className = 'status';
                analysisStatus.style.color = 'red';
                return;
            }

            const contextPrompt = analysisPromptInput.value.trim();
            const selectedModel = extractorModelSelect.value; // Read from EXTRACTOR dropdown

            analyzeBtn.disabled = true;
            analysisStatus.textContent = 'Analyzing image...';
            analysisStatus.className = 'status info';
            analysisStatus.style.color = '';
            analyzeSpinner.classList.add('visible'); // Show spinner

            // --- Immediately Create UI Structure --- 
            if (analysisResultsSection) {
                // Clear ONLY the results section, keep inputs/analyze button intact
                analysisResultsSection.innerHTML = ''; 
                // Hide buttons initially - reference the specific container
                if (analysisButtonsContainer) analysisButtonsContainer.style.display = 'none'; 
                recreateSvgStatus.textContent = '';

                // Create analysis section header
                const analysisHeader = document.createElement('h3');
                analysisHeader.textContent = '2. Review & Edit Analysis';
                analysisResultsSection.appendChild(analysisHeader);

                // Define the analysis types (MUST match backend keys and order)
                const analysisTypes = ['metadata', 'semantic', 'layout', 'content_styling', 'ocr'];

                // Create placeholder textareas immediately
                analysisTypes.forEach(key => {
                    // Generate a more readable label from the key
                    let labelText = key.replace(/_/g, ' '); // Replace underscores with spaces
                    labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1); // Capitalize first letter
                    // Add "Analysis" based on the key (summary removed)
                    labelText += ' Analysis:'; 

                    const blockDiv = document.createElement('div');
                    blockDiv.classList.add('analysis-block');

                    const label = document.createElement('label');
                    label.textContent = labelText;
                    label.htmlFor = `analysis-${key}`;

                    const textarea = document.createElement('textarea');
                    textarea.id = `analysis-${key}`; 
                    textarea.placeholder = 'Analyzing...'; // Placeholder text
                    textarea.value = ''; // Start empty
                    textarea.disabled = true; // Disable initially
                    textarea.dataset.analysisType = key;

                    // Add event listener for auto-resizing
                    textarea.addEventListener('input', () => autoResizeTextarea(textarea));

                    blockDiv.appendChild(label);
                    blockDiv.appendChild(textarea);
                    analysisResultsSection.appendChild(blockDiv);
                });

                // Add the recreate/copy button container and status elements
                if (analysisButtonsContainer) analysisResultsSection.appendChild(analysisButtonsContainer);
                analysisResultsSection.appendChild(recreateSvgStatus);

                // Show Recreate/Copy Buttons, but disabled initially
                if(analysisButtonsContainer) analysisButtonsContainer.style.display = 'flex'; // Use flex for display
                recreateSvgBtn.style.display = 'inline-block'; 
                copyMarkdownBtn.style.display = 'inline-block'; 
                recreateSvgBtn.disabled = true;
                copyMarkdownBtn.disabled = true; 
                analysisResultsSection.style.display = 'block'; // Make section visible
            }
            // --- End Immediate UI Creation ---

            try {
                const response = await fetch('/analyze_image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify({
                        image_data: currentImageDataUrl, 
                        context_prompt: contextPrompt,
                        model: selectedModel // Send extractor's selected model
                    })
                });

                if (!response.ok) {
                    let errorMsg = `Analysis failed (status ${response.status})`;
                    try {
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const errorData = await response.json();
                            errorMsg = `Analysis failed: ${errorData.error || JSON.stringify(errorData)}`;
                        } else {
                            const errorText = await response.text();
                            console.error("Non-JSON error response from /analyze_image:", errorText);
                            errorMsg = `Analysis failed: Server returned an unexpected response (status ${response.status}). Check console for details.`;
                        }
                    } catch (parseError) {
                        console.error("Error processing the error response from /analyze_image:", parseError);
                        errorMsg = `Analysis failed: Could not process error response (status ${response.status}).`;
                    }
                    throw new Error(errorMsg);
                }

                const data = await response.json();
                console.log("--- Data Received by Frontend ---"); // Keep logs for now
                console.log(data);
                console.log("--------------------------------");

                if (response.ok) {
                    analysisStatus.textContent = 'Analysis complete!';
                    analysisStatus.className = 'status';
                    analysisStatus.style.color = 'green';

                    // --- Populate Textareas --- 
                    if (analysisResultsSection) {
                         for (const [key, value] of Object.entries(data)) {
                            const textarea = document.getElementById(`analysis-${key}`);
                            if (textarea) {
                                textarea.value = value.trim();
                                textarea.disabled = false; // Re-enable textarea
                                textarea.placeholder = ''; // Clear placeholder
                                // Call auto-resize AFTER populating content
                                autoResizeTextarea(textarea);
                            }
                        }
                        // Enable buttons on success
                        recreateSvgBtn.disabled = false; 
                        copyMarkdownBtn.disabled = false;
                    }
                    // --- End Populate --- 
                } else {
                    // Handle backend error (e.g., API key issue, model error)
                     throw new Error(data.error || 'Unknown analysis error');
                }

            } catch (error) {
                console.error("Analysis Error:", error);
                analysisStatus.textContent = `Error: ${error.message}`;
                analysisStatus.className = 'status';
                analysisStatus.style.color = 'red';

                 // Update textareas to show error
                if (analysisResultsSection) {
                    const textareas = analysisResultsSection.querySelectorAll('textarea');
                    textareas.forEach(ta => {
                        ta.value = `Error: ${error.message}`;
                        ta.disabled = true; // Keep disabled on error
                        ta.placeholder = '';
                        ta.style.color = 'red'; // Indicate error in textarea
                    });
                    recreateSvgBtn.disabled = true; 
                    copyMarkdownBtn.disabled = true; 
                }
            } finally {
                analyzeBtn.disabled = false;
                analyzeSpinner.classList.remove('visible'); // Hide spinner
                 setTimeout(() => {
                    // Clear status message only if it wasn't an error
                    if (!analysisStatus.textContent.startsWith('Error:')) {
                       analysisStatus.textContent = '';
                    }
                }, 5000);
            }
        });
    }

    // --- Recreate SVG Button Listener (Renamed) ---
    async function handleRecreateSvg() {
        if (!currentImageDataUrl) {
            if (recreateStatusDisplay) recreateStatusDisplay.textContent = 'No image selected for recreation.';
            return;
        }

        const analysisData = getAnalysisDataFromTextareas(); 
        if (!analysisData) {
             if (recreateStatusDisplay) recreateStatusDisplay.textContent = 'Analysis data is missing or incomplete.';
              return;
        }
        
        const selectedModel = extractorModelSelect.value; 

        if (recreateButton) recreateButton.disabled = true;
        if (recreateStatusDisplay) {
             recreateStatusDisplay.textContent = 'Recreating SVG...';
             recreateStatusDisplay.className = 'status info';
             recreateStatusDisplay.style.color = '';
             recreateSpinner.classList.add('visible'); // Show spinner
        }

        try {
            const response = await fetch('/convert_to_svg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_data: currentImageDataUrl,
                    analysis_data: analysisData,
                    model: selectedModel
                }),
            });

            if (!response.ok) {
                let errorMsg = `SVG recreation failed (status ${response.status})`;
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMsg = `SVG recreation failed: ${errorData.error || JSON.stringify(errorData)}`;
                    } else {
                        const errorText = await response.text();
                        console.error("Non-JSON error response from /convert_to_svg:", errorText);
                        errorMsg = `SVG recreation failed: Server returned an unexpected response (status ${response.status}). Check console for details.`;
                    }
                } catch (parseError) {
                    console.error("Error processing the error response from /convert_to_svg:", parseError);
                    errorMsg = `SVG recreation failed: Could not process error response (status ${response.status}).`;
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();

            if (response.ok) {
                // ... (Success handling: update editor/preview, clear prompt, show success) ...
                const generatedSvgCode = data.svg_code;
                svgCodeEditor.value = generatedSvgCode;
                updatePreview(generatedSvgCode);
                if (recreateStatusDisplay) {
                     recreateStatusDisplay.textContent = 'Recreation successful!';
                     recreateStatusDisplay.className = 'status';
                     recreateStatusDisplay.style.color = 'green';
                }
                // TODO: Save extractor result to history
                // saveHistoryItemExtractor(...) 
                // updateHistoryList();

            } else {
                throw new Error(data.error || 'Unknown recreation error');
            }

        } catch (error) {
            console.error("Recreation Error:", error);
             if (recreateStatusDisplay) {
                 // Display the potentially more informative error message
                 recreateStatusDisplay.textContent = `Error: ${error.message}`;
                 recreateStatusDisplay.className = 'status';
                 recreateStatusDisplay.style.color = 'red';
             }
        } finally {
             if (recreateButton) recreateButton.disabled = false;
             recreateSpinner.classList.remove('visible'); // Hide spinner
             if (recreateStatusDisplay) {
                  setTimeout(() => {
                    if (!recreateStatusDisplay.textContent.startsWith('Error:')) {
                        recreateStatusDisplay.textContent = '';
                    }
                 }, 5000);
             }
        }
    }

    // --- Helper: Generate High-Res PNG Data URL from SVG Preview ---
    function generatePngFromSvgPreview(minDimension = 1000) {
        return new Promise((resolve, reject) => {
            const svgPreviewDiv = document.getElementById('svg-preview');
            const svgElement = svgPreviewDiv.querySelector('svg');

            if (!svgElement) {
                return reject(new Error('No SVG in preview to generate PNG.'));
            }

            const svgString = new XMLSerializer().serializeToString(svgElement);

            let svgWidth = svgElement.getAttribute('width') || svgElement.viewBox?.baseVal?.width || 300;
            let svgHeight = svgElement.getAttribute('height') || svgElement.viewBox?.baseVal?.height || 150;
            svgWidth = parseFloat(svgWidth) || 300;
            svgHeight = parseFloat(svgHeight) || 150;
            const aspectRatio = svgWidth / svgHeight;

            // Determine target dimensions based on minDimension
            const qualityScale = 2; // Start with 2x
            let targetWidth = svgWidth * qualityScale;
            let targetHeight = svgHeight * qualityScale;

            if (targetWidth < minDimension && targetHeight < minDimension) {
                let scaleFactor = (svgWidth >= svgHeight) ? (minDimension / targetWidth) : (minDimension / targetHeight);
                targetWidth *= scaleFactor;
                targetHeight *= scaleFactor;
            }
            const canvasWidth = Math.round(targetWidth);
            const canvasHeight = Math.round(targetHeight);

            const canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d');
            const img = new Image();

            let svgData = svgString;
            if (!svgData.includes('xmlns=')) {
                svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                try {
                    const pngUrl = canvas.toDataURL('image/png');
                    URL.revokeObjectURL(url);
                    resolve(pngUrl); // Resolve promise with Base64 PNG data URL
                } catch (e) {
                    URL.revokeObjectURL(url);
                    reject(new Error("Error converting canvas to PNG: " + e.message));
                }
            };

            img.onerror = (e) => {
                URL.revokeObjectURL(url);
                reject(new Error("Error loading SVG into image element for PNG generation."));
            };

            img.src = url;
        });
    }

    // --- Update Refine SVG Button Listener ---
    async function handleRefineSvg() {
        const refinementPrompt = refinementPromptInput.value.trim();
        const currentSvg = svgCodeEditor.value.trim();
        const selectedModel = refineModelSelect.value; 

        if (!refinementPrompt) {
            refineStatus.textContent = 'Please enter refinement instructions.';
            refineStatus.className = 'status error';
            refineStatus.style.color = 'red';
            return;
        }
        if (!currentSvg) {
            refineStatus.textContent = 'No SVG code to refine.';
            refineStatus.className = 'status error';
            refineStatus.style.color = 'red';
            return;
        }

        refineBtn.disabled = true;
        refineStatus.textContent = 'Refining SVG...';
        refineStatus.className = 'status info';
        refineStatus.style.color = '';
        refineSpinner.classList.add('visible'); // Show spinner initially for PNG gen

        let pngDataUrl = null;
        try {
            // --- Generate PNG --- 
            pngDataUrl = await generatePngFromSvgPreview(1000); // Default to 1000px min

            refineStatus.textContent = 'Refining SVG with analysis...'; // Update status (spinner stays visible)

            // --- Fetch Call --- 
            const response = await fetch('/refine_svg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    original_svg: currentSvg,
                    refinement_prompt: refinementPrompt,
                    model: selectedModel,
                    png_data: pngDataUrl // Include the generated PNG data URL
                })
            });

            if (!response.ok) {
                let errorMsg = `Refinement failed (status ${response.status})`;
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMsg = `Refinement failed: ${errorData.error || JSON.stringify(errorData)}`;
                    } else {
                        const errorText = await response.text();
                        console.error("Non-JSON error response from /refine_svg:", errorText);
                        errorMsg = `Refinement failed: Server returned an unexpected response (status ${response.status}). Check console for details.`;
                    }
                } catch (parseError) {
                    console.error("Error processing the error response from /refine_svg:", parseError);
                    errorMsg = `Refinement failed: Could not process error response (status ${response.status}).`;
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();

            if (response.ok) {
                // ... (Success handling: update editor/preview, clear prompt, show success) ...
                const refinedSvgCode = data.svg_code;
                svgCodeEditor.value = refinedSvgCode;
                updatePreview(refinedSvgCode);
                refinementPromptInput.value = ''; // Clear refinement input
                refineStatus.textContent = 'Refinement successful!';
                refineStatus.className = 'status';
                refineStatus.style.color = 'green';
                // ... (Save to history) ...
                const currentPrompt = promptInput.value.trim(); 
                // FIX: Convert NodeList to Array before using .find()
                const activeComplexityButton = Array.from(complexityButtons).find(btn => btn.classList.contains('active'));
                const complexity = activeComplexityButton ? parseInt(activeComplexityButton.dataset.value, 10) : 3; // Default 3 if not found
                // FIX: Convert NodeList to Array before using .find()
                const activeColorUsageButton = Array.from(colorUsageButtons).find(btn => btn.classList.contains('active'));
                const colorUsage = activeColorUsageButton ? parseInt(activeColorUsageButton.dataset.value, 10) : 3; // Default 3 if not found
                saveHistoryItem(currentPrompt + ` (Refined${refinementPrompt ? ': ' + refinementPrompt.substring(0,20) + '...': ' - Auto'})`, complexity, colorUsage, selectedModel, refinedSvgCode);
                updateHistoryList();
            } else {
                throw new Error(data.error || 'Unknown refinement error');
            }

        } catch (error) {
            console.error("Refinement/PNG Error:", error);
            refineStatus.textContent = `Error: ${error.message}`;
            refineStatus.className = 'status';
            refineStatus.style.color = 'red';
        } finally {
            refineBtn.disabled = false;
            refineSpinner.classList.remove('visible'); // Hide spinner
            setTimeout(() => {
                if (!refineStatus.textContent.startsWith('Error:')) {
                    refineStatus.textContent = '';
                }
            }, 5000);
        }
    }

    // --- Copy Markdown Button Listener ---
    function handleCopyMarkdown() {
        const analysisTypes = ['metadata', 'semantic', 'layout', 'content_styling', 'ocr'];
        let markdownString = '';
        let firstSection = true;

        analysisTypes.forEach(key => {
            const textarea = document.getElementById(`analysis-${key}`);
            if (textarea && textarea.value.trim() !== '') {
                // Generate readable label/header
                let labelText = key.replace(/_/g, ' ');
                labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1);
                labelText += ' Analysis:'; 

                if (!firstSection) {
                    markdownString += '\n\n---\n\n'; // Add separator between sections
                }
                markdownString += `## ${labelText}\n\n`;
                markdownString += textarea.value.trim();
                firstSection = false;
            }
        });

        if (markdownString && navigator.clipboard) {
            navigator.clipboard.writeText(markdownString).then(() => {
                // Success feedback
                const originalText = copyMarkdownBtn.textContent;
                copyMarkdownBtn.textContent = 'Copied!';
                copyMarkdownBtn.disabled = true;
                setTimeout(() => {
                    copyMarkdownBtn.textContent = originalText;
                    copyMarkdownBtn.disabled = false;
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy markdown: ', err);
                alert('Failed to copy markdown to clipboard.');
            });
        } else if (!markdownString) {
             alert('No analysis content available to copy.');
        } else {
            alert('Clipboard API not available in this browser.');
        }
    }

    // --- Assign Listener to Recreate Button ---
    if (recreateSvgBtn) {
        recreateSvgBtn.addEventListener('click', handleRecreateSvg);
    }

    // --- Assign Listener to Refine Button ---
    if (refineBtn) {
        refineBtn.addEventListener('click', handleRefineSvg);
    }

    // --- Assign Listener to Copy Markdown Button ---
    if (copyMarkdownBtn) {
        copyMarkdownBtn.addEventListener('click', handleCopyMarkdown);
    }

    // --- PNG Dimension Input Logic ---
    let currentSvgAspectRatio = 1;

    // Function to update PNG dimension inputs based on aspect ratio
    function updatePngDimensions(changedInput) {
        const svgElement = svgPreview.querySelector('svg');
        if (!svgElement) {
            console.warn("updatePngDimensions: No SVG found in preview.");
            return; // No SVG, can't calculate
        }

        // Recalculate aspect ratio from current SVG
        let svgWidth = svgElement.getAttribute('width') || svgElement.viewBox?.baseVal?.width || 300;
        let svgHeight = svgElement.getAttribute('height') || svgElement.viewBox?.baseVal?.height || 150;
        svgWidth = parseFloat(svgWidth) || 300; // Fallback width
        svgHeight = parseFloat(svgHeight) || 1; // Fallback height > 0
        
        // Ensure height is not zero for division
        if (svgHeight <= 0) svgHeight = 1; 
        currentSvgAspectRatio = svgWidth / svgHeight;
        console.log("SVG Aspect Ratio:", currentSvgAspectRatio);

        const widthInput = pngWidthInput;
        const heightInput = pngHeightInput;
        // Handle NaN from parseInt if input is empty or invalid
        const widthVal = parseInt(widthInput.value, 10) || 0;
        const heightVal = parseInt(heightInput.value, 10) || 0;
        console.log("Parsed Dimensions:", { widthVal, heightVal });

        if (changedInput === widthInput && widthVal > 0) {
            const calculatedHeight = Math.round(widthVal / currentSvgAspectRatio);
            heightInput.value = calculatedHeight;
            heightInput.placeholder = calculatedHeight; 
            heightInput.classList.add('auto-populated');
            widthInput.classList.remove('auto-populated');
            console.log("Calculated Height:", calculatedHeight);
        } else if (changedInput === heightInput && heightVal > 0) {
            const calculatedWidth = Math.round(heightVal * currentSvgAspectRatio);
            widthInput.value = calculatedWidth;
            widthInput.placeholder = calculatedWidth;
            widthInput.classList.add('auto-populated');
            heightInput.classList.remove('auto-populated');
            console.log("Calculated Width:", calculatedWidth);
        } else {
            // If input cleared or invalid, clear the other and reset placeholders/styles
            if (changedInput === widthInput) {
                heightInput.value = '';
                heightInput.placeholder = '(auto-scales)';
                heightInput.classList.remove('auto-populated');
                console.log("Cleared Height Input");
            } else if (changedInput === heightInput) {
                widthInput.value = '';
                widthInput.placeholder = '(auto-scales)';
                widthInput.classList.remove('auto-populated');
                 console.log("Cleared Width Input");
            }
        }
    }

    if (pngWidthInput && pngHeightInput) {
        pngWidthInput.addEventListener('input', () => updatePngDimensions(pngWidthInput));
        pngHeightInput.addEventListener('input', () => updatePngDimensions(pngHeightInput));
    }

    // --- Update Save PNG Functionality ---
    async function handleSavePng(event, useCustomDimensions = false) {
        const svgPreviewDiv = document.getElementById('svg-preview');
        const svgElement = svgPreviewDiv.querySelector('svg');

        if (!svgElement) {
            alert('No SVG in preview to save as PNG.');
            return;
        }

        // Get the current SVG code as a string
        const svgString = new XMLSerializer().serializeToString(svgElement);

        // Get dimensions from SVG for aspect ratio calculation
        let svgWidth = svgElement.getAttribute('width') || svgElement.viewBox?.baseVal?.width || 300; 
        let svgHeight = svgElement.getAttribute('height') || svgElement.viewBox?.baseVal?.height || 150; 
        svgWidth = parseFloat(svgWidth) || 300;
        svgHeight = parseFloat(svgHeight) || 150; // Keep a reasonable default height
        // Ensure height is not zero for division
        if (svgHeight <= 0) svgHeight = 150; 
        const aspectRatio = svgWidth / svgHeight;

        let canvasWidth, canvasHeight;
        
        // --- Determine Canvas Dimensions --- 
        if (useCustomDimensions) {
            console.log("Using custom dimensions for PNG save...");
            const userWidth = parseInt(pngWidthInput.value, 10);
            const userHeight = parseInt(pngHeightInput.value, 10);
            if (userWidth > 0) {
                canvasWidth = userWidth;
                canvasHeight = Math.round(userWidth / aspectRatio);
                console.log("Using user width:", canvasWidth, canvasHeight);
            } else if (userHeight > 0) {
                canvasHeight = userHeight;
                canvasWidth = Math.round(userHeight * aspectRatio);
                console.log("Using user height:", canvasWidth, canvasHeight);
            } else {
                alert("Please enter a width or height for custom PNG save.");
                return; // Don't proceed if custom dimensions requested but none provided
            }
        } else {
             // Default save logic (e.g., use SVG dimensions or a fixed scale)
            console.log("Using default dimensions for PNG save...");
            // Example: Use intrinsic SVG size or a default like 1000px wide
            canvasWidth = svgWidth; // Or set a fixed default canvasWidth = 1000;
            canvasHeight = svgHeight; // Or calc based on fixed canvasHeight = Math.round(canvasWidth / aspectRatio);
            
            // --- OR use the previous scaling logic for default ---
            // const qualityScale = 2;
            // const minDimension = 1000;
            // let targetWidth = svgWidth * qualityScale;
            // let targetHeight = svgHeight * qualityScale;
            // if (targetWidth < minDimension && targetHeight < minDimension) {
            //     let scaleFactor = (svgWidth >= svgHeight) ? (minDimension / targetWidth) : (minDimension / targetHeight);
            //     targetWidth *= scaleFactor;
            //     targetHeight *= scaleFactor;
            // }
            // canvasWidth = Math.round(targetWidth);
            // canvasHeight = Math.round(targetHeight);
            // --- End scaling logic ---
        }

        // Ensure minimum dimensions if calculated
        canvasWidth = Math.max(1, canvasWidth || 300); // Ensure minimum size
        canvasHeight = Math.max(1, canvasHeight || 150);
        console.log("Final Canvas Dimensions:", canvasWidth, canvasHeight);

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // Create an image element
        const img = new Image();

        // Create Blob and Object URL
        let svgData = svgString;
        if (!svgData.includes('xmlns=')) {
            svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            try {
                const pngUrl = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                // Differentiate filename based on save type
                const baseFilename = promptInput.value.trim().substring(0, 30).replace(/[^a-z0-9]/gi, '_') || 'generated';
                downloadLink.download = useCustomDimensions ? `${baseFilename}_custom.png` : `${baseFilename}.png`; 
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } catch (e) {
                console.error("Error converting canvas to PNG:", e);
                alert("Failed to save SVG as PNG. The SVG might be too complex or contain unsupported features.");
            } finally {
                URL.revokeObjectURL(url);
            }
        };

        img.onerror = (e) => {
            console.error("Error loading SVG into image element:", e);
            alert("Failed to load SVG for PNG conversion. Please check SVG code for errors.");
            URL.revokeObjectURL(url); 
        };

        img.src = url;
    }

    // --- Function to check and update Save Custom PNG button state ---
    function updateCustomPngButtonState() {
        const widthVal = parseInt(pngWidthInput.value, 10) || 0;
        const heightVal = parseInt(pngHeightInput.value, 10) || 0;
        const svgPresent = svgCodeEditor.value && svgCodeEditor.value.trim().length > 0;

        if (svgPresent && (widthVal > 0 || heightVal > 0)) {
            saveCustomPngBtn.disabled = false;
            saveCustomPngBtn.classList.add('primary-btn');
            saveCustomPngBtn.classList.remove('secondary-btn');
        } else {
            saveCustomPngBtn.disabled = true;
            saveCustomPngBtn.classList.remove('primary-btn');
            saveCustomPngBtn.classList.add('secondary-btn');
        }
    }
    
    // Helper to reset custom png button
    function resetCustomPngButtonState() {
        saveCustomPngBtn.disabled = true;
        saveCustomPngBtn.classList.remove('primary-btn');
        saveCustomPngBtn.classList.add('secondary-btn');
    }

    // --- Initial Setup ---
    updatePreview('');
    updateHistoryList();
    // Activate the default tab (Generator) on load
    switchTab('generator-tab-content');

    // --- ADDED: Randomize Container Borders ---
    function randomizeContainerBorders() {
        const containers = document.querySelectorAll('.container');
        const color1 = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#E69500';
        const color2 = '#C774E8'; // Keep the second color fixed for now

        containers.forEach(container => {
            const randomAngle = Math.floor(Math.random() * 360);
            const gradient = `linear-gradient(${randomAngle}deg, ${color1}, ${color2})`;
            container.style.borderImageSource = gradient;
            // console.log(`Applied gradient to container: ${gradient}`); // Optional debug log
        });
    }
    randomizeContainerBorders(); // Call the function on load
    // --- END Randomize Borders --- 
}); 