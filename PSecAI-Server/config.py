import os
from dotenv import load_dotenv

load_dotenv()


DB_CONFIG = {
    "MONGO_URI": os.getenv("MONGO_URI", "mongodb+srv://PsecAI:Kasy%40123@cluster0.1vsiqgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
    "DB_NAME": os.getenv("DB_NAME", "PSecAI_db")
}
