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
