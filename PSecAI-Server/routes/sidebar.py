from flask import Blueprint, jsonify, request
from database import get_db_connection

report_bp = Blueprint("report", __name__)

@report_bp.route("/reports", methods=["GET"])
def get_reports():
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

@report_bp.route("/reports/<filename>", methods=["DELETE"])
def delete_report(filename):
    """Delete a report from the database."""
    try:
        db = get_db_connection()
        reports_collection = db["Uploaded_Reports"]

        result = reports_collection.delete_one({"filename": filename})

        if result.deleted_count > 0:
            return jsonify({"message": "Report deleted successfully"}), 200
        else:
            return jsonify({"error": "Report not found"}), 404
    except Exception as e:
        print(f"Error deleting report: {e}")
        return jsonify({"error": "Failed to delete report"}), 500
