from pymongo import MongoClient
import datetime
from config import DB_CONFIG

# Create a connection to MongoDB
def get_db_connection():
    client = MongoClient(DB_CONFIG["MONGO_URI"])  # Ensure MongoDB is running locally
    db = client[DB_CONFIG["DB_NAME"]]
    return db

# Save report metadata and extracted text to MongoDB
def save_report(user_id, filename, extracted_text):
    db = get_db_connection()
    reports_collection = db.reports  # Collection name: reports

    # Prepare document for insertion
    report_data = {
        "user_id": user_id,
        "filename": filename,
        "extracted_text": extracted_text,
        "created_at": datetime.datetime.utcnow()  # Timestamp for tracking
    }

    # Insert into MongoDB
    reports_collection.insert_one(report_data)
    print("Report saved to MongoDB successfully.")
