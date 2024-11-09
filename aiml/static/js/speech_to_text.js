// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let isListening = false;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // You can change the language here
} else {
    console.error('Speech recognition not supported');
}

const languageSelect = document.getElementById('language-select');
languageSelect.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    recognition.lang = selectedLanguage;
    console.log(`Speech recognition language set to: ${selectedLanguage}`);
});

// Voice Input Button
const voiceButton = document.getElementById('voice-input-btn');
let speechTimeout;

if (recognition) {
    voiceButton.addEventListener('click', toggleSpeechRecognition);
} else {
    voiceButton.style.display = 'none';
}

function toggleSpeechRecognition() {
    if (!isListening) {
        startListening();
    } else {
        stopListening();
    }
}

function startListening() {
    isListening = true;
    voiceButton.classList.add('listening');
    showSpeechTooltip('Listening...');
    
    recognition.start();
}

function stopListening() {
    isListening = false;
    voiceButton.classList.remove('listening');
    hideSpeechTooltip();
    
    recognition.stop();
}

// Create tooltip element
const tooltip = document.createElement('div');
tooltip.className = 'speech-tooltip';
document.querySelector('.input-container').appendChild(tooltip);

function showSpeechTooltip(message) {
    tooltip.textContent = message;
    tooltip.classList.add('show');
}

function hideSpeechTooltip() {
    tooltip.classList.remove('show');
}

// Speech Recognition Event Handlers
if (recognition) {
    recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        if (event.results[current].isFinal) {
            userInput.value = transcript;
            // Auto adjust textarea height
            userInput.style.height = 'auto';
            userInput.style.height = userInput.scrollHeight + 'px';
        }
    };

    recognition.onstart = () => {
        showSpeechTooltip('Listening...');
    };

    recognition.onend = () => {
        if (isListening) {
            recognition.start();
        } else {
            hideSpeechTooltip();
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
            showSpeechTooltip('No speech detected. Try again.');
        } else {
            showSpeechTooltip('Error occurred. Please try again.');
        }
        
        setTimeout(() => {
            hideSpeechTooltip();
            stopListening();
        }, 2000);
    };
}

// Add keyboard shortcut for voice input (Ctrl/Cmd + Shift + V)
document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'v') {
        event.preventDefault();
        if (recognition) {
            toggleSpeechRecognition();
        }
    }
});

// Auto-stop listening after 10 seconds of silence
function resetSpeechTimeout() {
    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => {
        if (isListening) {
            showSpeechTooltip('Stopped listening due to silence');
            setTimeout(() => {
                stopListening();
            }, 1500);
        }
    }, 15000); // 10 seconds
}

if (recognition) {
    recognition.onaudiostart = resetSpeechTimeout;
    recognition.onaudioend = resetSpeechTimeout;
    recognition.onspeechstart = resetSpeechTimeout;
    recognition.onspeechend = resetSpeechTimeout;
}

// Cleanup function
window.addEventListener('beforeunload', () => {
    if (isListening) {
        stopListening();
    }
});
