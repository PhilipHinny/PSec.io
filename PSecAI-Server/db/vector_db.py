from pymongo import MongoClient
from config import DB_CONFIG
import datetime

# Create a connection to MongoDB
def get_db_connection():
    client = MongoClient(DB_CONFIG["MONGO_URI"])  
    db = client[DB_CONFIG["DB_NAME"]]
    return db

def save_generated_report(user_id, report_text, filename):
    """
    Saves a generated report into the Generated_Reports collection.
    The correct order should be (user_id, report_text, filename).
    """
    db = get_db_connection()
    generated_reports_collection = db["Generated_Reports"]

    try:
        report_data = {
            "user_id": user_id,
            "report_text": report_text,  # Store the actual report text
            "filename": filename,  # Store the filename separately
            "created_at": datetime.datetime.utcnow()
        }

        generated_reports_collection.insert_one(report_data)
        print(f"Generated report saved correctly for user {user_id}")
    except Exception as e:
        print(f"Error saving generated report: {e}")

def retrieve_similar_reports(user_id, top_k=5):
    """
    Retrieves the most recent reports for a given user.
    """
    db = get_db_connection()
    generated_reports_collection = db["Generated_Reports"]

    # Retrieve user's reports sorted by most recent
    user_reports = list(
        generated_reports_collection.find({"user_id": user_id}).sort("created_at", -1).limit(top_k)
    )

    # Return report texts
    return [report["report_text"] for report in user_reports]
