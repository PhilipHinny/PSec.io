from flask import Blueprint, jsonify, request
from database import get_db_connection

report_bp = Blueprint("report", __name__)

@report_bp.route("/reports", methods=["GET"])
def get_reports():
    """Fetch uploaded reports for a specific user or all reports if user_id is not provided."""
    try:
        user_id = request.args.get("user_id")
        
        db = get_db_connection()
        reports_collection = db["Generated_Reports"]

        # Build query: filter by user_id if provided, else fetch all reports
        query = {}
        if user_id:
            query["user_id"] = user_id

        reports = list(reports_collection.find(
            query,
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
