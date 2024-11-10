// Trigger file input when upload button is clicked
document.getElementById('upload-button').addEventListener('click', function () {
    document.getElementById('file-upload').click();
});

// Handle file selection and show file preview in the prompt area before uploading
document.getElementById('file-upload').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
        displayMessage("Unsupported file type. Please upload a PDF or image file.", 'bot-message');
        return;
    }

    // Show file preview in the prompt area
    displayFilePrompt(file);

    // Prepare FormData to send the file to the server
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionId);

    // Show typing indicator
    showTypingIndicator();

    // Send the file to the server
    fetch('/upload_report', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        hideTypingIndicator();
        if (data.analysis) {
            displayMessage(data.analysis, 'bot-message');
        } else {
            displayMessage("Sorry, I couldn't analyze the report. Please try again.", 'bot-message');
        }
    })
    .catch(error => {
        hideTypingIndicator();
        displayMessage("Error uploading file. Please try again.", 'bot-message');
        console.error('Error:', error);
    });
});

// Function to show the file in the prompt area
function displayFilePrompt(file) {
    const inputContainer = document.querySelector('.input-container');
    const filePrompt = document.createElement('div');
    filePrompt.classList.add('file-prompt');

    if (file.type === 'application/pdf') {
        filePrompt.innerHTML = `<i class="fas fa-file-pdf"></i> ${file.name} <span>PDF</span>`;
    } else if (file.type.startsWith('image/')) {
        filePrompt.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="${file.name}" class="file-thumbnail"> ${file.name}`;
    }

    // Clear previous file prompt if any
    const previousFilePrompt = document.querySelector('.file-prompt');
    if (previousFilePrompt) previousFilePrompt.remove();

    inputContainer.insertBefore(filePrompt, document.getElementById('user-input'));
}

