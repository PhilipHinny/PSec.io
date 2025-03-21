import ollama
from db.vector_db import retrieve_reports

def generate_report(user_id, prompt):
    past_reports = retrieve_reports(user_id)
    context = "\n\n".join(past_reports)

    gpt_prompt = f"""You are an AI report writer.
    The user has previously written reports like this:
    {context}

    Now, generate a new report based on the following request:
    {prompt}
    """

    response = ollama.chat(
        model="llama3.2",  # Or "mistral" for better performance
        messages=[{"role": "user", "content": gpt_prompt}]
    )

    return response["message"]["content"]  # Extracts the generated text
