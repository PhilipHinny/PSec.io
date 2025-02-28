from flask import Blueprint, request, jsonify
from services.ai_service import generate_report

generate_bp = Blueprint("generate", __name__)

@generate_bp.route("/generate_report", methods=["POST"])
def generate():
    print("Received a request for report generation!")  # Debug print
    data = request.json
    user_id = data.get("user_id")
    prompt = data.get("prompt")

    if not user_id or not prompt:
        return jsonify({"error": "Missing user_id or prompt"}), 400

    generated_report = generate_report(user_id, prompt)

    return jsonify({"generated_report": generated_report})

