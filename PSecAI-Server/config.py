import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "Open_ai_api")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "PINECONE_API")
PINECONE_INDEX_NAME = "reports"

DB_CONFIG = {
    "MONGO_URI": os.getenv("MONGO_URI", "mongodb+srv://PsecAI:Kasy%40123@cluster0.1vsiqgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
    "DB_NAME": os.getenv("DB_NAME", "reports_db")
}
