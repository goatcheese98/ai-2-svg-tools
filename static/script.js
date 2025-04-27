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

    // Background Control Elements
    const backgroundControlButtons = document.querySelectorAll('.bg-control-btn');

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
    const dropZone = document.getElementById('drop-zone'); // Add drop zone reference

    // Placeholders for future elements
    const analysisResultsSection = document.getElementById('analysis-results-section');
    const recreateSvgBtn = document.getElementById('recreate-svg-btn');
    const recreateSvgStatus = document.getElementById('recreate-svg-status');
    const copyMarkdownBtn = document.getElementById('copy-markdown-btn');
    const analysisButtonsContainer = document.querySelector('#analysis-results-section .analysis-actions'); // Ref the specific button container

    // Refinement Elements
    const refinementPromptInput = document.getElementById('refinement-prompt');
    const refineModelSelect = document.getElementById('refine-model-select'); // New Refine Model Select
    const refineBtn = document.getElementById('refine-btn');
    const refineStatus = document.getElementById('refine-status');

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

    // Function to update SVG preview
    function updatePreview(svgCode) {
        // Clear previous preview content
        svgPreview.innerHTML = '';

        if (!svgCode.trim()) {
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

        // --- UPDATE: Get values from buttons --- 
        const complexity = getSelectedButtonValue(complexityButtons);
        const colorUsage = getSelectedButtonValue(colorUsageButtons);
        const selectedModel = modelSelect.value; // Get selected model

        // Update UI: Start Loading
        _update_generation_ui(true, 'Generating SVG...');
        svgCodeEditor.value = '';
        updatePreview('');

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ prompt: currentPrompt, complexity: complexity, colorUsage: colorUsage, model: selectedModel })
            });
            const data = await response.json();

            if (response.ok) {
                const generatedSvgCode = data.svg_code;
                svgCodeEditor.value = generatedSvgCode;
                updatePreview(generatedSvgCode);

                // Update UI: Success
                _update_generation_ui(false, 'SVG generated successfully!');

                // --- UPDATE: Pass button values to history --- 
                saveHistoryItem(currentPrompt, complexity, colorUsage, selectedModel, generatedSvgCode);
                updateHistoryList();

            } else {
                 // Let the catch block handle the UI update for errors
                throw new Error(data.error || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Generation Error:', error);
            // Update UI: Error
            _update_generation_ui(false, `Error: ${error.message}`, true);
            updatePreview(''); // Clear preview on error
        } finally {
             // Button re-enabling is handled by _update_generation_ui(false, ...)
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
        buttons.forEach(btn => {
            if (parseInt(btn.dataset.value, 10) === value) {
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
            const selectedBg = button.dataset.bg;

            // Remove active class from all buttons
            backgroundControlButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            // Update preview box class
            svgPreview.classList.remove('bg-transparent', 'bg-white', 'bg-black');
            svgPreview.classList.add(`bg-${selectedBg}`);

             // Persist preference in local storage
             localStorage.setItem('previewBackground', selectedBg);
        });
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

    // Update preview on code editor input (with debouncing)
    svgCodeEditor.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            updatePreview(svgCodeEditor.value);
        }, 300);
    });

    saveBtn.addEventListener('click', handleSave);
    copyBtn.addEventListener('click', handleCopy);
    clearHistoryBtn.addEventListener('click', clearHistory); // Add listener for clear button

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
        // Find the elements (using updated IDs)
        const recreateButton = document.getElementById('recreate-svg-btn');
        const recreateStatusDisplay = document.getElementById('recreate-svg-status');

        if (!currentImageDataUrl) {
            if (recreateStatusDisplay) recreateStatusDisplay.textContent = 'Missing image data.';
            return;
        }

        // Gather analysis data from textareas (Update order)
        const analysisData = {};
        const analysisTypes = ['metadata', 'semantic', 'layout', 'content_styling', 'ocr'];
        let analysisComplete = true;
        analysisTypes.forEach(type => {
            const textarea = document.getElementById(`analysis-${type}`);
            if (textarea && textarea.value.trim() !== '') {
                analysisData[type] = textarea.value.trim();
            } else {
                analysisComplete = false; 
            }
        });

        if (!analysisComplete) {
             if (recreateStatusDisplay) recreateStatusDisplay.textContent = 'Error gathering analysis data.';
              return;
        }

        const selectedModel = extractorModelSelect.value; // Use EXTRACTOR dropdown value

        if (recreateButton) recreateButton.disabled = true;
        if (recreateStatusDisplay) {
             recreateStatusDisplay.textContent = 'Recreating SVG...';
             recreateStatusDisplay.className = 'status info';
             recreateStatusDisplay.style.color = '';
        }

        try {
            const response = await fetch('/convert_to_svg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    image_data: currentImageDataUrl, 
                    analysis_data: analysisData,
                    model: selectedModel // Send extractor's selected model
                })
            });

            const data = await response.json();

            if (response.ok) {
                const generatedSvgCode = data.svg_code;
                // Update the SHARED editor and preview
                svgCodeEditor.value = generatedSvgCode;
                updatePreview(generatedSvgCode);
                if (recreateStatusDisplay) {
                     recreateStatusDisplay.textContent = 'Recreation successful!';
                     recreateStatusDisplay.className = 'status';
                     recreateStatusDisplay.style.color = 'green';
                }
                // TODO: Save extractor result to history (using a different structure)
                // saveHistoryItemExtractor(...) 
                // updateHistoryList();
            } else {
                throw new Error(data.error || 'Unknown recreation error');
            }

        } catch (error) {
            console.error("Recreation Error:", error);
             if (recreateStatusDisplay) {
                 recreateStatusDisplay.textContent = `Error: ${error.message}`;
                 recreateStatusDisplay.className = 'status';
                 recreateStatusDisplay.style.color = 'red';
             }
        } finally {
             if (recreateButton) recreateButton.disabled = false;
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
        const currentSvgCode = svgCodeEditor.value.trim();
        const refinementInstructions = refinementPromptInput.value.trim();
        const selectedModel = refineModelSelect.value; // Use REFINE dropdown value

        // --- Validation --- 
        if (!currentSvgCode) {
            refineStatus.textContent = 'No SVG code in the editor to refine.';
            refineStatus.className = 'status error';
            refineStatus.style.color = 'red';
            return;
        }
        // Refinement instructions are now optional for self-critique
        // if (!refinementInstructions) { ... }

        refineBtn.disabled = true;
        refineStatus.textContent = 'Generating preview PNG...'; // New status
        refineStatus.className = 'status info';
        refineStatus.style.color = '';

        let pngDataUrl = null;
        try {
            // --- Generate PNG --- 
            pngDataUrl = await generatePngFromSvgPreview(1000); // Default to 1000px min

            refineStatus.textContent = 'Refining SVG with analysis...'; // Update status

            // --- Fetch Call --- 
            const response = await fetch('/refine_svg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    svg_code: currentSvgCode,
                    refinement_prompt: refinementInstructions, // Can be empty
                    model: selectedModel,
                    png_data: pngDataUrl // Include the generated PNG data URL
                })
            });

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
                const complexity = parseInt(complexityButtons.find(btn => btn.classList.contains('active')).dataset.value, 10);
                const colorUsage = parseInt(colorUsageButtons.find(btn => btn.classList.contains('active')).dataset.value, 10);
                saveHistoryItem(currentPrompt + ` (Refined${refinementInstructions ? ': ' + refinementInstructions.substring(0,20) + '...': ' - Auto'})`, complexity, colorUsage, selectedModel, refinedSvgCode);
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
        if (!svgElement) return; // No SVG, can't calculate

        // Recalculate aspect ratio from current SVG
        let svgWidth = svgElement.getAttribute('width') || svgElement.viewBox?.baseVal?.width || 300;
        let svgHeight = svgElement.getAttribute('height') || svgElement.viewBox?.baseVal?.height || 150;
        svgWidth = parseFloat(svgWidth) || 300;
        svgHeight = parseFloat(svgHeight) || 1;
        currentSvgAspectRatio = svgWidth / svgHeight;

        const widthInput = pngWidthInput;
        const heightInput = pngHeightInput;
        const widthVal = parseInt(widthInput.value, 10);
        const heightVal = parseInt(heightInput.value, 10);

        if (changedInput === widthInput && widthVal > 0) {
            heightInput.value = Math.round(widthVal / currentSvgAspectRatio);
            heightInput.placeholder = Math.round(widthVal / currentSvgAspectRatio); // Update placeholder too
            heightInput.classList.add('auto-populated'); // Optional: Style auto-populated field
            widthInput.classList.remove('auto-populated');
        } else if (changedInput === heightInput && heightVal > 0) {
            widthInput.value = Math.round(heightVal * currentSvgAspectRatio);
            widthInput.placeholder = Math.round(heightVal * currentSvgAspectRatio);
            widthInput.classList.add('auto-populated');
            heightInput.classList.remove('auto-populated');
        } else {
            // If input cleared or invalid, clear the other and reset placeholders/styles
            if (changedInput === widthInput) {
                heightInput.value = '';
                heightInput.placeholder = '(auto)';
                heightInput.classList.remove('auto-populated');
            } else if (changedInput === heightInput) {
                widthInput.value = '';
                widthInput.placeholder = '(auto)';
                widthInput.classList.remove('auto-populated');
            }
        }
    }

    if (pngWidthInput && pngHeightInput) {
        pngWidthInput.addEventListener('input', () => updatePngDimensions(pngWidthInput));
        pngHeightInput.addEventListener('input', () => updatePngDimensions(pngHeightInput));
    }

    // --- Update Save PNG Functionality ---
    async function handleSavePng() {
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
        svgHeight = parseFloat(svgHeight) || 150;
        const aspectRatio = svgWidth / svgHeight;

        let canvasWidth, canvasHeight;
        const userWidth = parseInt(pngWidthInput.value, 10);
        const userHeight = parseInt(pngHeightInput.value, 10);

        // --- Determine Canvas Dimensions --- 
        if (userWidth > 0) {
            canvasWidth = userWidth;
            canvasHeight = Math.round(userWidth / aspectRatio);
            console.log("Using user width:", canvasWidth, canvasHeight);
        } else if (userHeight > 0) {
            canvasHeight = userHeight;
            canvasWidth = Math.round(userHeight * aspectRatio);
            console.log("Using user height:", canvasWidth, canvasHeight);
        } else {
            // Fallback to previous logic (2x scale + 1000px min)
            console.log("Using default scaling...");
            const qualityScale = 2;
            const minDimension = 1000;
            let targetWidth = svgWidth * qualityScale;
            let targetHeight = svgHeight * qualityScale;

            if (targetWidth < minDimension && targetHeight < minDimension) {
                let scaleFactor;
                if (svgWidth >= svgHeight) {
                    scaleFactor = minDimension / targetWidth;
                } else {
                    scaleFactor = minDimension / targetHeight;
                }
                targetWidth *= scaleFactor;
                targetHeight *= scaleFactor;
            }
            canvasWidth = Math.round(targetWidth);
            canvasHeight = Math.round(targetHeight);
        }

        // Ensure minimum dimensions if calculated
        canvasWidth = Math.max(1, canvasWidth); 
        canvasHeight = Math.max(1, canvasHeight);

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // Create an image element
        const img = new Image();

        // Create Blob and Object URL
        // IMPORTANT: Ensure SVG string has xmlns attribute for proper rendering in image/canvas
        let svgData = svgString;
        if (!svgData.includes('xmlns=')) {
            svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            // Draw image onto canvas scaled up
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

            // Convert canvas to PNG data URL
            try {
                const pngUrl = canvas.toDataURL('image/png');

                // Trigger download
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = 'ai-generated-svg.png'; // Filename
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

            } catch (e) {
                console.error("Error converting canvas to PNG:", e);
                alert("Failed to save SVG as PNG. The SVG might be too complex or contain unsupported features.");
            } finally {
                // Clean up the object URL
                URL.revokeObjectURL(url);
            }
        };

        img.onerror = (e) => {
            console.error("Error loading SVG into image element:", e);
            alert("Failed to load SVG for PNG conversion. Please check SVG code for errors.");
            URL.revokeObjectURL(url); // Clean up on error too
        };

        // Set image source
        img.src = url;
    }

    if (savePngBtn) {
        savePngBtn.addEventListener('click', handleSavePng);
    }

    // --- Initial Setup ---
    updatePreview('');
    updateHistoryList();
    // Activate the default tab (Generator) on load
    switchTab('generator-tab-content');
}); 