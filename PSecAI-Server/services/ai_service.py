from openai import OpenAI
from config import OPENAI_API_KEY
from db.vector_db import retrieve_reports

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_report(user_id, prompt):
    past_reports = retrieve_reports(user_id)
    context = "\n\n".join(past_reports)

    gpt_prompt = f"""You are an AI report writer.
    The user has previously written reports like this:
    {context}

    Now, generate a new report based on the following request:
    {prompt}
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # Correct model name
        messages=[{"role": "system", "content": gpt_prompt}],
        max_tokens=1500
    )

    return response.choices[0].message.content  # Correct way to access response
