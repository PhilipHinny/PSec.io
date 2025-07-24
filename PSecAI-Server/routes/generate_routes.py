from flask import Blueprint, request, jsonify
from services.ai_service import generate_report
import asyncio

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

    # Use edit_prompt or follow_up_prompt if present, otherwise use prompt
    final_prompt = edit_prompt or follow_up_prompt or prompt
    generated_report = asyncio.run(generate_report(user_id, final_prompt))

    return jsonify({"generated_report": generated_report})
