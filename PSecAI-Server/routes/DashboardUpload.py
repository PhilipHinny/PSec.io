from flask import Blueprint, request, jsonify
from services.ai_service import generate_report
import asyncio
import json

generate_bp = Blueprint("generate", __name__)

@generate_bp.route("/generate_report", methods=["POST"])
def generate():
    print("Received a request for report generation!")

    data = request.json
    user_id = data.get("user_id")
    prompt = data.get("prompt")
    edit_prompt = data.get("edit_prompt")
    follow_up_prompt = data.get("follow_up_prompt")

    if not user_id or (not prompt and not edit_prompt and not follow_up_prompt):
        return jsonify({"error": "Missing user_id and prompt or edit/follow-up prompt"}), 400

    # Determine the final prompt
    final_prompt = edit_prompt or follow_up_prompt or prompt

    try:
        # Run the async function safely
        if asyncio.get_event_loop().is_running():
            # If already inside an event loop (like Flask dev server), use create_task
            task = asyncio.create_task(generate_report(user_id, final_prompt))
            generated_report = asyncio.get_event_loop().run_until_complete(task)
        else:
            generated_report = asyncio.run(generate_report(user_id, final_prompt))

        # Check that the generated report is not empty
        if not generated_report:
            raise ValueError("AI service returned an empty response")

        return jsonify({"generated_report": generated_report})

    except json.JSONDecodeError as e:
        print("JSON decoding error:", e)
        return jsonify({"error": "Invalid response from AI service"}), 500
    except Exception as e:
        print("Error generating report:", e)
        return jsonify({"error": str(e)}), 500
