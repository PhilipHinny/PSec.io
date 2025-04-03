from flask import Blueprint, jsonify
from database import get_db_connection

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/report-stats", methods=["GET"])
def get_report_stats():
    """
    API endpoint to get the count of uploaded reports.
    """
    try:
        db = get_db_connection()
        reports_collection = db["Uploaded_Reports"]
        Generated_collection = db["Generated_Reports"]
        
        # Count the number of uploaded reports
        uploaded_count = reports_collection.count_documents({}) 
        generated_count = Generated_collection.count_documents({})
        
        # Return the counts in a JSON response
        return jsonify({
            "uploaded_count": uploaded_count,
            "generated_count": generated_count

        }), 200

    except Exception as e:
        print(f"Error fetching report stats: {e}")
        return jsonify({"error": "Failed to fetch report stats"}), 500
