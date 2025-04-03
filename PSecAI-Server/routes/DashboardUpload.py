from flask import Blueprint, jsonify
from database import get_db_connection

Dashboardupload_bp = Blueprint("report", __name__)

@Dashboardupload_bp.route("/Dashboardupload", methods=["GET"])
def get_uploaded_reports():
    """Fetch uploaded reports."""
    try:
        db = get_db_connection()
        reports_collection = db["Uploaded_Reports"]

        reports = list(reports_collection.find({}, {"_id": 0, "filename": 1, "created_at": 1}))

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
