import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv(OPENAI_API_KEY = os.getenv("OPENAI_API_KEY","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"))
PINECONE_API_KEY = os.getenv(PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "pcsk_2EcWqJ_UC24u6QGzgr5FAxzgKcVui8aD91HLp5a1G198ri8aSgdAvcuqQFtE26U29k34SP"))
PINECONE_INDEX_NAME = "reports"
DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
}
