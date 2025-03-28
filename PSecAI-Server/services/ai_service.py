import ollama
from db.vector_db import retrieve_reports  # Only retrieve past reports from DB

# Dictionary to temporarily store the last report per user
last_generated_reports = {}

def generate_report(user_id, prompt):
    """
    Generates a report based on user input, using past reports as context.
    Stores the generated report in memory (without saving to DB).
    """
    past_reports = retrieve_reports(user_id)
    context = "\n\n".join(past_reports)

    gpt_prompt = f"""You are an AI report writer.
    The user has previously written reports like this:
    {context}

    Now, generate a new report based on the following request:
    {prompt}
    """

    response = ollama.chat(
        model="llama3.2",  
        messages=[{"role": "user", "content": gpt_prompt}]
    )

    report = response["message"]["content"]
    last_generated_reports[user_id] = report  

    return report

def edit_report(user_id, edit_prompt):
    """
    Edits the last generated report using an additional user instruction.
    The report is stored and retrieved from memory (not DB).
    """
    if user_id not in last_generated_reports:
        return "There is no previous report to edit. Please generate a new report first."

    last_report = last_generated_reports[user_id]

    gpt_prompt = f"""You are an AI report editor.
    Here is the latest report the user generated:
    {last_report}

    Now, apply the following modifications based on the user's request:
    {edit_prompt}
    """

    response = ollama.chat(
        model="llama3.2",
        messages=[{"role": "user", "content": gpt_prompt}]
    )

    edited_report = response["message"]["content"]
    last_generated_reports[user_id] = edited_report  # Update the report in memory

    return edited_report
