import os
import uuid
import asyncio
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from docx import Document
from fpdf import FPDF
import httpx
from database import get_uploaded_report_texts, log_recent_activity
from db.vector_db import save_generated_report  # Add this import

# Your database imports (stub for example)
# Replace with your actual DB hooks
# from db.vector_db import save_generated_report, retrieve_similar_reports
# from database import log_recent_activity, get_uploaded_report_texts

app = FastAPI()

# ==== CONFIG ====
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
REFERER = os.getenv("REFERER", "http://localhost:5173")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

# === In-memory session caches ===
last_generated_reports = {}
last_user_sessions = {}

# ==== SYSTEM PROMPT ====
PSEC_SYSTEM_PROMPT = '''
You are PSEC AI, an intelligent assistant that generates highly personalized reports for users.

# Core Behavior

- When a user uploads a report, analyze its formatting, structure, and tone.
- When the user requests a new report, always use the most recently uploaded report as a template for style, structure, and formatting, unless the user specifies otherwise.
- The content of the new report should be based on the user's prompt, but the formatting, headers, bullet points, and overall style should match the uploaded report as closely as possible.
- If the user asks for a report in a new domain (e.g., Q2 sales, wellness AI, etc.), use the uploaded report as a template for how the new report should look.

# Input

Users will provide:
1. A prompt describing the new report they want (e.g., "Create a Q2 2025 sales report", "Generate a wellness AI documentation").
2. Optionally, a specific format or reference to a previous report.

# Output Rules

- Always follow the formatting, structure, and tone of the uploaded report, unless the user requests a different style.
- Do not copy the content of the uploaded report, but use its format as a template.
- If the uploaded report is missing or cannot be used, politely ask the user to upload a sample or specify a format.
- If the prompt is unclear, ask follow-up questions.

# Output Style

- Only return the fully formatted, ready-to-use report.
- Do not include commentary or markdown headers like "## Report" unless the template uses them.
'''

# === HELPERS ===

async def openrouter_chat(messages, model="mistral"):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Referer": REFERER,
        "X-Title": "psec-ai",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": messages
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(OPENROUTER_API_URL, json=payload, headers=headers, timeout=60)
        response.raise_for_status()
        return response.json()

# ==== MOCK DB ====
# def get_uploaded_report_texts(user_id):

def retrieve_similar_reports(user_id):
    # Replace with your vector DB call
    return ["Generated Report Example"]

def log_recent_activity(user_id, title, category, status):
    print(f"LOG: User={user_id}, Title={title}, Cat={category}, Status={status}")

# ==== MAIN GENERATE ====
@app.post("/generate")
async def generate_report(user_id: str, prompt: str, file_type: str = "pdf"):
    try:
        uploaded_reports = get_uploaded_report_texts(user_id)
        generated_reports = retrieve_similar_reports(user_id)
        all_reports = uploaded_reports + generated_reports
        # Use only the most recent uploaded report, truncated to 2000 characters
        context = all_reports[0][:2000] if all_reports else "No previous reports available."

        # Debug prints to show what is sent to the AI
        print("[DEBUG] Context sent to AI (first 500 chars):\n", context[:500])
        user_input = f"Summary of recent activities and request: {prompt}\n\nReference reports:\n{context}"
        print("[DEBUG] User input sent to AI:\n", user_input[:500])
        messages = [
            {"role": "system", "content": PSEC_SYSTEM_PROMPT},
            {"role": "user", "content": user_input}
        ]

        model_names = [
            "qwen/qwen3-coder:free"
        ]

        for model in model_names:
            print(f"\n--- Trying model: {model} ---")
            try:
                response = await openrouter_chat(messages, model=model)
                print("[DEBUG] Raw AI response:", response)
                report = response["choices"][0]["message"]["content"]

                last_generated_reports[user_id] = report
                last_user_sessions[user_id] = {"prompt": prompt, "report": report}

                # Save the generated report to the database for sidebar display
                from datetime import datetime
                filename = f"Report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
                save_generated_report(user_id, report, filename)

                # Log recent activity for dashboard
                log_recent_activity(user_id, prompt, "Generated", "Successful")

                print(f"✅ Model {model} succeeded!")
                return {
                    "report": report
                }

            except Exception as e:
                print(f"⚠️ Model {model} failed: {e}")

        print("❌ All models failed.")
        return {"error": "Could not generate report."}

    except Exception as e:
        print(f"💥 Fatal error: {e}")
        log_recent_activity(user_id, "Generated Report", "Generated", "Failed")
        return {"error": "Internal server error."}

# ==== DOWNLOAD ROUTE ====
@app.get("/downloads/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(DOWNLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename=filename)
    return JSONResponse(status_code=404, content={"error": "File not found"})

# ==== RESET SESSION ====
@app.post("/reset/{user_id}")
async def reset_user_session(user_id: str):
    last_user_sessions.pop(user_id, None)
    last_generated_reports.pop(user_id, None)
    return {"status": "Session reset."}
