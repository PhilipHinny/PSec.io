from flask import Blueprint, jsonify
from database import get_db_connection  # Import your database connection function

report_bp = Blueprint("report", __name__)

@report_bp.route("/reports", methods=["GET"])
def get_reports():
    """
    API endpoint to get the list of reports.
    """
    try:
        db = get_db_connection()
        reports_collection = db["Uploaded_Reports"]
        
        # Fetch reports, excluding the _id field
        reports = list(reports_collection.find({}, {"_id": 0, "filename": 1, "created_at": 1}))
        
        # Format the reports to match what the frontend expects
        formatted_reports = [
            {
                "title": report["filename"],
                "date": report["created_at"].strftime("%b %d, %Y")  # Format the date
            }
            for report in reports
        ]
        
        return jsonify({"reports": formatted_reports}), 200
    
    except Exception as e:
        print(f"Error fetching reports: {e}")
        return jsonify({"error": "Failed to fetch reports"}), 500
