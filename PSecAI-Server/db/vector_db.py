from pymongo import MongoClient
from config import DB_CONFIG
from langchain_community.embeddings import OpenAIEmbeddings

# MongoDB Setup
client = MongoClient(DB_CONFIG["MONGO_URI"])
db = client[DB_CONFIG["DB_NAME"]]
reports_collection = db["Generated_Reports"]

def save_generated_report(user_id, report_text, filename):
    # Generate embedding
    embedding = OpenAIEmbeddings().embed_query(report_text)
    
    # Prepare the document
    report_doc = {
        "user_id": user_id,
        "filename": filename,
        "report_text": report_text,
        "embedding": embedding
    }
    
    # Insert into MongoDB
    reports_collection.insert_one(report_doc)
    print(f"Generated report saved for user {user_id}")

def retrieve_similar_reports(user_id, top_k=5):
    user_reports = list(reports_collection.find({"user_id": user_id}))

    if not user_reports:
        return []

    target_embedding = user_reports[0]["embedding"]

    # Calculate Euclidean Distance
    def euclidean_distance(vec1, vec2):
        return sum((a - b) ** 2 for a, b in zip(vec1, vec2)) ** 0.5

    # Rank reports
    scored_reports = []
    for report in user_reports:
        distance = euclidean_distance(target_embedding, report["embedding"])
        scored_reports.append((distance, report["report_text"]))

    # Sort and return top_k
    scored_reports.sort(key=lambda x: x[0])
    return [text for _, text in scored_reports[:top_k]]
