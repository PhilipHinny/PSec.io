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
        
        # Count the number of uploaded reports
        uploaded_count = reports_collection.count_documents({})  # Counts all documents in the collection
        
        # Assuming you want to fetch the count for generated and downloaded reports, 
        # you'd need to filter based on status or other attributes, for example:
        generated_count = reports_collection.count_documents({"status": "Generated"})
        downloaded_count = reports_collection.count_documents({"status": "Downloaded"})
        
        # Return the counts in a JSON response
        return jsonify({
            "uploaded_count": uploaded_count,
            "generated_count": generated_count,
            "downloaded_count": downloaded_count
        }), 200

    except Exception as e:
        print(f"Error fetching report stats: {e}")
        return jsonify({"error": "Failed to fetch report stats"}), 500
