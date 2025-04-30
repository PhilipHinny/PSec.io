from flask import Blueprint, jsonify, request
from database import get_db_connection

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/report-stats", methods=["GET"])
def get_report_stats():
    """
    API endpoint to get the count of uploaded and generated reports for a specific user.
    """
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        db = get_db_connection()
        reports_collection = db["Uploaded_Reports"]
        generated_collection = db["Generated_Reports"]
        
        # Count only documents where user_id matches
        uploaded_count = reports_collection.count_documents({"user_id": user_id})
        generated_count = generated_collection.count_documents({"user_id": user_id})
        
        return jsonify({
            "uploaded_count": uploaded_count,
            "generated_count": generated_count
        }), 200

    except Exception as e:
        print(f"Error fetching report stats: {e}")
        return jsonify({"error": "Failed to fetch report stats"}), 500
