from flask import Blueprint, jsonify, request
from database import get_db_connection

Deleteupload_bp = Blueprint("report", __name__)

@Deleteupload_bp.route("/Deleteupload", methods=["DELETE"])
def delete_report():
    """Delete a report based on user_id and filename."""
    user_id = request.args.get("user_id")
    filename = request.args.get("filename")
    
    if not user_id or not filename:
        return jsonify({"error": "User ID and filename are required"}), 400

    try:
        db = get_db_connection()
        reports_collection = db["Uploaded_Reports"]

        # Find and delete the report from the database
        result = reports_collection.delete_one({"user_id": user_id, "filename": filename})

        if result.deleted_count > 0:
            return jsonify({"status": "success", "message": "Report deleted successfully"}), 200
        else:
            return jsonify({"error": "Report not found"}), 404
    except Exception as e:
        print(f"Error deleting report: {e}")
        return jsonify({"error": "Failed to delete report"}), 500
