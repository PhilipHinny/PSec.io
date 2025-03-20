from pymongo import MongoClient
from config import DB_CONFIG

# Create a connection to MongoDB
def get_db_connection():
    client = MongoClient(DB_CONFIG["MONGO_URI"])
    db = client[DB_CONFIG["DB_NAME"]]
    return db

# Save report metadata to MongoDB
def save_report_metadata(user_id, filename):
    db = get_db_connection()
    reports_collection = db.reports  # Assuming 'reports' is the name of your collection
    
    # Insert the report metadata as a document
    report_data = {
        "user_id": user_id,
        "filename": filename,
        "created_at": datetime.datetime.utcnow()  # Optional: Adding a timestamp
    }
    reports_collection.insert_one(report_data)
