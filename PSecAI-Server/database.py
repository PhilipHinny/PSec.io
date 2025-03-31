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
    reports_collection = db["Uploaded_Reports"]  # Fixed collection name
    
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
