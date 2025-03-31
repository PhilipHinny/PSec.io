from flask import Blueprint, request, jsonify
from db.vector_db import save_generated_report

get_reports_bp = Blueprint("get_reports", __name__)

@get_reports_bp.route("/get_reports", methods=["GET"])
def get_reports():
    user_id = request.args.get("user_id")  # Get user_id from query parameters
    
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    
    try:
        reports = save_generated_report(user_id)  # Fetch reports from the database
        
        if not reports:
            return jsonify({"message": "No reports found for this user."}), 404
        
        return jsonify({"reports": reports}), 200
    
    except Exception as e:
        print(f"Error fetching reports: {e}")
        return jsonify({"error": "Failed to retrieve reports"}), 500
