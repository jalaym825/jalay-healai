from flask import Flask, render_template, request, jsonify
from flask_session import Session
from flask_cors import CORS  # Import CORS
from datetime import datetime
from dotenv import load_dotenv
import os
from chat.bot import ChatBot

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Initialize ChatBot
chatbot = ChatBot()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    user_message = data.get("message")
    session_id = data.get("session_id", "default")
    
    if user_message:
        try:
            response = chatbot.get_response(user_message, session_id)
            return jsonify({
                "response": response,
                "timestamp": datetime.now().strftime("%H:%M")
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "No message received"}), 400

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))  # Default to 5000 if PORT is not set
    app.run(debug=True, host="0.0.0.0", port=port)
