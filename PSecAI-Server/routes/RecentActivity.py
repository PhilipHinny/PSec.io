from flask import Blueprint, jsonify
from database import get_db_connection

activity_bp = Blueprint("activity", __name__)

@activity_bp.route("/recent-activity", methods=["GET"])
def get_recent_activity():
    """
    API endpoint to get the recent activity log.
    """
    try:
        db = get_db_connection()
        activity_collection = db["Recent_Activity"]
        
        # Fetch recent activities, sorted by latest first
        activities = list(activity_collection.find({}, {"_id": 0}).sort("date_time", -1).limit(10))

        return jsonify({"recent_activity": activities}), 200

    except Exception as e:
        print(f"Error fetching recent activity: {e}")
        return jsonify({"error": "Failed to fetch recent activity"}), 500
