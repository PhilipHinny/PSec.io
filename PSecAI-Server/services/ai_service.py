from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os
from datetime import datetime
from services.ai_service import save_generated_report  # Your DB save function
import httpx
import asyncio

app = FastAPI()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
REFERER = os.getenv("REFERER", "http://localhost:5173")
OPENROUTER_API_URL = "https://openrouter.ai/v1/completions"  # Correct inference endpoint

DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

# In-memory session caches
last_generated_reports = {}
last_user_sessions = {}

# System prompt
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
''' # Your existing system prompt

# === Helper for calling OpenRouter API ===
async def openrouter_chat(messages, model="amazon/nova-2-lite-v1:free"):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Referer": REFERER,
        "Content-Type": "application/json"
    }
    payload = {"model": model, "messages": messages}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(OPENROUTER_API_URL, json=payload, headers=headers, timeout=60)
            response.raise_for_status()
            if not response.text:
                raise ValueError("Empty response from OpenRouter API")
            data = response.json()
            return data
        except httpx.HTTPStatusError as e:
            print(f"HTTP error from OpenRouter: {e.response.status_code} {e.response.text}")
            raise
        except ValueError as ve:
            print(f"Value error: {ve}")
            raise
        except Exception as ex:
            print(f"Unexpected error calling OpenRouter: {ex}")
            raise

# === Generate Report Route ===
@app.post("/generate")
async def generate_report_route(user_id: str, prompt: str, file_type: str = "pdf"):
    if not user_id or not prompt:
        return JSONResponse(status_code=400, content={"error": "Missing user_id or prompt"})

    try:
        # Retrieve previous reports (mocked)
        from database import get_uploaded_report_texts
        uploaded_reports = get_uploaded_report_texts(user_id) or []
        context = uploaded_reports[0][:2000] if uploaded_reports else "No previous reports available."

        user_input = f"Summary of recent activities and request: {prompt}\n\nReference reports:\n{context}"
        messages = [
            {"role": "system", "content": PSEC_SYSTEM_PROMPT},
            {"role": "user", "content": user_input}
        ]

        model_names = ["amazon/nova-2-lite-v1:free"]
        last_error = None

        for model in model_names:
            print(f"\n--- Trying model: {model} ---")
            try:
                response = await openrouter_chat(messages, model=model)
                print("[DEBUG] Raw AI response:", response)

                if "choices" not in response or not response["choices"]:
                    raise ValueError("No choices returned from AI")

                report = response["choices"][0]["message"]["content"]

                # Save in memory session
                last_generated_reports[user_id] = report
                last_user_sessions[user_id] = {"prompt": prompt, "report": report}

                # Save report in DB
                filename = f"Report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
                save_generated_report(user_id, report, filename)

                print(f"✅ Model {model} succeeded!")
                return {"report": report}

            except Exception as e:
                print(f"⚠️ Model {model} failed: {e}")
                last_error = str(e)

        print("❌ All models failed.")
        return JSONResponse(status_code=500, content={"error": f"Could not generate report. Last error: {last_error}"})

    except Exception as e:
        print(f"💥 Fatal error in generate route: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})
