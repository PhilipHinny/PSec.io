from flask import Blueprint, jsonify, request
from database import get_db_connection

Dashboardupload_bp = Blueprint("report", __name__)

@Dashboardupload_bp.route("/Dashboardupload", methods=["GET"])
def get_uploaded_reports():
    """Fetch uploaded reports."""

    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        db = get_db_connection()
        reports_collection = db["Uploaded_Reports"]

        reports = list(reports_collection.find({"user_id": user_id}, {"_id": 0, "filename": 1, "created_at": 1}))

        formatted_reports = [
            {
                "title": report["filename"],
                "date": report["created_at"].strftime("%b %d, %Y"),
            }
            for report in reports
        ]

        return jsonify({"reports": formatted_reports}), 200
    except Exception as e:
        print(f"Error fetching reports: {e}")
        return jsonify({"error": "Failed to fetch reports"}), 500
