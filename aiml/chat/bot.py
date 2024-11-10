import os
from datetime import datetime
import google.generativeai as genai

# Language detection and translation functionality
from langdetect import detect
from googletrans import Translator

# Initialize the Google Translator
translator = Translator()

def detect_and_translate_to_english(text):
    try:
        language = detect(text)

        # If the language is not English, translate it to English
        if language != 'en':
            translated_text = translator.translate(text, src=language, dest='en').text
        else:
            translated_text = text

        return translated_text, language
    except Exception as e:
        print(f"Error in language detection/translation: {str(e)}")
        return text, 'en'  # Return the original text and assume English if detection/translation fails


class ChatBot:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel("gemini-pro")
        self.sessions = {}

        # System prompt to set the bot's behavior
        self.system_prompt = """You are a specialized healthcare and mental illness support assistant. Your responses must:
            1. Only address health, wellness, or medical-related questions. Politely decline to engage in any non-medical topics.
            2. Be accurate, concise, and clear, prioritizing the user's well-being and safety.
            3. Display empathy and understanding, with a focus on active listening and offering appropriate support.
            4. Identify and acknowledge potential symptoms of illness and suggest over-the-counter medications when safe to do so, including necessary precautions and important considerations.
            5. Emphasize preventive measures, healthy practices, and when to seek professional medical attention.
            6. Always maintain professionalism and ensure recommendations align with safe medical practices.
            Remember, your focus is strictly on medical and health-related concerns. Gently redirect or refuse non-medical inquiries."""

        self.keywords = [
            "health", "wellness", "symptoms", "treatment",
            "mental health", "medicine", "doctor", "diagnosis", "therapy"
        ]

    def get_or_create_chat(self, session_id):
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                'chat': self.model.start_chat(history=[]),
                'history': []
            }
        return self.sessions[session_id]

    def get_response(self, message, session_id="default"):
        session = self.get_or_create_chat(session_id)
        chat = session['chat']

        try:
            # Add message to history
            session['history'].append({
                'role': 'user',
                'content': message,
                'timestamp': datetime.now().strftime("%H:%M")
            })

            # Translate the message to English and detect original language
            translated_message, detected_language = detect_and_translate_to_english(message)

            # Get response from model
            response = chat.send_message(translated_message)
            response_text = response.text

            # Check if the response is off-topic
            if not self.is_healthcare_related(response_text):
                response_text = (
                    "I'm here to assist with health and wellness-related questions. "
                    "Please ask about medical concerns, symptoms, or mental health support."
                )

            # Translate response back to original language if it was not English
            if detected_language != 'en':
                response_text = translator.translate(response_text, src='en', dest=detected_language).text

            # Add response to history
            session['history'].append({
                'role': 'assistant',
                'content': response_text,
                'timestamp': datetime.now().strftime("%H:%M")
            })

            return response_text

        except Exception as e:
            raise Exception(f"Error getting response: {str(e)}")

    def is_healthcare_related(self, response_text):
        # Check if any of the keywords are present in the translated response
        return any(keyword in response_text.lower() for keyword in self.keywords)

    def get_chat_history(self, session_id="default"):
        session = self.get_or_create_chat(session_id)
        return session['history']
