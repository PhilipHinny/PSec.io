import os
from flask import Blueprint, jsonify
from database import get_db_connection

Generate_bp = Blueprint("Generated", __name__)

@Generate_bp.route("/generated_reports", methods=["GET"])
def get_generated_report():
    """
    API endpoint to get the most recent generated reports.
    """
    try:
        db = get_db_connection()
        generate_collection = db["Generated_Reports"]
        
        # Fetch recent reports sorted by latest first
        generated_reports = list(
            generate_collection.find({}, {"_id": 0}).sort("created_at", -1).limit(10)
        )

        return jsonify({"generated_reports": generated_reports}), 200

    except Exception as e:
        print(f"Error fetching reports: {e}")
        return jsonify({"error": "Failed to fetch reports"}), 500
