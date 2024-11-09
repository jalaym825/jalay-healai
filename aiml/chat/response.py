from google.generativeai import generative_models
import os

# Get the API key from environment variables
api_key = os.getenv("GEMINI_API_KEY")

def handle_message(user_message, chat_history):
    # Append the user's message to the chat history in the required format
    chat_history.append({'role': 'user', 'content': user_message})

    # Initialize the generative model API, passing the API key
    generative_models.configure(api_key=api_key)

    try:
        # Generate a response
        response = generative_models.chat(
            context=chat_history,  # Pass chat history for context
            model="chat-bison",  # Ensure this model is supported by Gemini API
        )

        # Get the response from the model
        bot_response = response['message']['content']

        # Append the bot's response to the chat history
        chat_history.append({'role': 'bot', 'content': bot_response})

        return bot_response, chat_history
    except Exception as e:
        raise Exception(f"Error interacting with the generative model: {str(e)}")