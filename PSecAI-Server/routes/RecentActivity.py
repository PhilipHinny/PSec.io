from flask import Blueprint, jsonify, request
from database import get_db_connection

activity_bp = Blueprint("activity", __name__)

@activity_bp.route("/recent-activity", methods=["GET"])
def get_recent_activity():
    """
    API endpoint to get the recent activity log for a specific user.
    """
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400


    try:
        db = get_db_connection()
        activity_collection = db["Recent_Activity"]
        
        # Fetch recent activities for the specific user
        activities = list(
            activity_collection.find({"user_id": user_id}, {"_id": 0})
            .sort("date_time", -1)
            .limit(10)
        )

        return jsonify({"recent_activity": activities}), 200

    except Exception as e:
        print(f"Error fetching recent activity: {e}")
        return jsonify({"error": "Failed to fetch recent activity"}), 500
