from pymongo import MongoClient
import datetime
from config import DB_CONFIG

# Create a connection to MongoDB
def get_db_connection():
    client = MongoClient(DB_CONFIG["MONGO_URI"])  
    db = client[DB_CONFIG["DB_NAME"]]
    return db

# Save uploaded report metadata (and extracted text, if available)
def save_report_metadata(user_id, filename, extracted_text=None):
    db = get_db_connection()
    reports_collection = db["Uploaded_Reports"]  
    
    try:
        # Prepare document
        report_data = {
            "user_id": user_id,
            "filename": filename,
            "extracted_text": extracted_text,  # Optional field
            "created_at": datetime.datetime.utcnow()
        }
        
        # Insert into MongoDB
        reports_collection.insert_one(report_data)
        print(f"Uploaded report saved for user {user_id}")

        # Log activity for uploaded report if successful
        log_recent_activity(user_id, filename, "Uploaded", "Successful")

    except Exception as e:
        print(f"Error uploading report: {e}")

        # Log activity for failed report upload
        log_recent_activity(user_id, filename, "Uploaded", "Failed")

def log_recent_activity(user_id, document_name, action, status):
    """
    Logs any recent activities (e.g., report generated, report uploaded).
    """
    db = get_db_connection()
    activity_collection = db["Recent_Activity"]  # Collection is auto-created if it doesn't exist

    activity_data = {
        "user_id": user_id,
        "document_name": document_name,
        "action": action,
        "status": status,
        "date_time": datetime.datetime.utcnow().strftime("%b %d, %Y, %I:%M %p")  # Log formatted date and time
    }

    activity_collection.insert_one(activity_data)  # Save log
    print(f"Activity logged: {action} - {document_name} - Status: {status}")

# Function to get the logged-in user's ID (just an example, you'd typically retrieve this from a session or token)
def get_logged_in_user_id():
    # You may want to implement actual logic here to fetch the logged-in user, like getting the user from a session or token.
    return "some_user_id"  # Replace this with actual user fetching logic.

# Function to get the current user plan
def get_user_plan_from_db(user_id):
    db = get_db_connection()
    plans_collection = db["User_Plans"]  # Collection where the user plans are stored
    
    # Fetch the user's plan (assuming each user has a single plan stored)
    user_plan = plans_collection.find_one({"user_id": user_id})
    
    if not user_plan:
        raise Exception("No plan found for the user")
    
    return user_plan
