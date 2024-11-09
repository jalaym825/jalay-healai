// Multilingual Text-to-Speech with Play/Stop Toggle
let isSpeaking = false;
let synth = window.speechSynthesis;
let currentUtterance;

function toggleSpeech(text, lang) {
    if (isSpeaking) {
        synth.cancel(); // Stop speaking if already speaking
        isSpeaking = false;
    } else {
        // Set up new SpeechSynthesisUtterance
        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = lang; // Set TTS language

        // Add event listener to reset on end
        currentUtterance.onend = () => {
            isSpeaking = false;
        };

        // Start speaking
        synth.speak(currentUtterance);
        isSpeaking = true;
    }
}

// Function to Detect Language
function detectLanguage(text) {
    if (text.match(/[\u0900-\u097F]/)) return 'hi-IN'; // Hindi script
    if (text.match(/[\u0A80-\u0AFF]/)) return 'gu-IN'; // Gujarati script
    if (text.match(/[\u0900-\u097F\u0A80-\u0AFF]/)) return 'mr-IN'; // Marathi script
    return 'en-US'; // Default to English
}

function displayMessage(text, className, timestamp = null) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    
    // Create message text
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.textContent = text;
    messageDiv.appendChild(messageText);
    
    // Add timestamp if provided
    if (timestamp) {
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'timestamp';   
        timestampDiv.textContent = timestamp;
        messageDiv.appendChild(timestampDiv);
    }

    // Add "Listen" button if it's a bot message
    if (className === 'bot-message') {
        const listenButton = document.createElement('button');
        listenButton.className = 'listen-button';
        listenButton.textContent = '🔊 Listen';
        listenButton.addEventListener('click', () => {
            const lang = detectLanguage(text);
            toggleSpeech(text, lang);
        });
        messageDiv.appendChild(listenButton);
    }

    chatBox.appendChild(messageDiv);
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Add animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    
    // Trigger animation
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 50);
}

// Focus input on page load
window.addEventListener('load', () => {
    document.getElementById('user-input').focus();
});