from env import API_KEY
from transformers import pipeline
import env
import google.generativeai as genai

genai.configure(api_key=env.API_KEY)

_model = genai.GenerativeModel("gemini-2.0-flash-lite")
def llm_response(user_query, context):

    prompt = f"""
    Use the following context to answer the question. Do not make up any information.
    Context:
    {context}

    Question: {user_query}

    Answer:
    """

    response = _model.generate_content(
        prompt,
        generation_config={
            "temperature": 0.2,
            "max_output_tokens": 512,
        }
    )
    
    return response.text
    