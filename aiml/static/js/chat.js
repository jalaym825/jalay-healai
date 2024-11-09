// Generate a unique session ID for this chat
const sessionId = 'session_' + Date.now();

// Auto-resize textarea
const userInput = document.getElementById('user-input');
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Send message handlers
document.getElementById('send-button').addEventListener('click', sendMessage);
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

function showTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    indicator.style.display = 'flex';
}

function hideTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    indicator.style.display = 'none';
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;

    // Display user message
    displayMessage(message, 'user-message');
    
    // Clear input and reset height
    userInput.value = '';
    userInput.style.height = 'auto';

    // Show typing indicator
    showTypingIndicator();

    // Send message to backend
    fetch('/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            session_id: sessionId
        })
    })
    .then(response => response.json())
    .then(data => {
        hideTypingIndicator();
        if (data.response) {
            displayMessage(data.response, 'bot-message', data.timestamp);
        } else {
            displayMessage("I apologize, but I'm having trouble responding right now. Please try again.", 'bot-message');
        }
    })
    .catch(error => {
        hideTypingIndicator();
        displayMessage("I apologize, but I'm having trouble connecting. Please check your internet connection and try again.", 'bot-message');
        console.error('Error:', error);
    });
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
            // Restart recognition if it was still supposed to be listening
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
