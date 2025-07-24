from flask import Blueprint, jsonify, request
from database import get_db_connection

report_bp = Blueprint("report", __name__)

@report_bp.route("/reports", methods=["GET"])
def get_reports():
    """Fetch uploaded reports for a specific user."""
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"error": "Missing user_id"}), 400

        db = get_db_connection()
        reports_collection = db["Generated_Reports"]

        # Only fetch reports that belong to the given user_id
        reports = list(reports_collection.find(
            {"user_id": user_id},
            {"_id": 0, "filename": 1, "created_at": 1, "report_text": 1}
        ))

        formatted_reports = [
            {
                "title": report["filename"],
                "date": report["created_at"].strftime("%b %d, %Y"),
                "preview": (report.get("report_text") or "")[:100]
            }
            for report in reports
        ]

        return jsonify({"reports": formatted_reports}), 200

    except Exception as e:
        print(f"Error fetching reports: {e}")
        return jsonify({"error": "Failed to fetch reports"}), 500
