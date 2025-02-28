from flask import Blueprint, request, jsonify
from services.file_service import extract_text_from_file
from db.vector_db import store_report
from db.sql_db import save_report_metadata

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload_report", methods=["POST"])
def upload_report():
    user_id = request.form.get("user_id")
    file = request.files["file"]

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    report_text = extract_text_from_file(file)
    store_report(user_id, report_text)
    save_report_metadata(user_id, file.filename)

    return jsonify({"message": "Report uploaded successfully!"})
