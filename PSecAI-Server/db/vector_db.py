from config import PINECONE_INDEX_NAME
from langchain_community.embeddings import OpenAIEmbeddings
import os
from pinecone import Pinecone, ServerlessSpec

# Initialize Pinecone using the API key from environment variables
os.environ["PINECONE_API_KEY"] = "pcsk_2EcWqJ_UC24u6QGzgr5FAxzgKcVui8aD91HLp5a1G198ri8aSgdAvcuqQFtE26U29k34SP"
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

# Example: Create index if it doesn't exist
if 'reports' not in pc.list_indexes().names():
    pc.create_index(
        name='reports',
        dimension=1536,
        metric='euclidean',
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'
        )
    )

vector_db = pc.Index(PINECONE_INDEX_NAME)

def store_report(user_id, report_text):
    embedding = OpenAIEmbeddings().embed_query(report_text)
    vector_db.upsert([(user_id, embedding, {"text": report_text})])

def retrieve_reports(user_id, top_k=5):
    results = vector_db.query(user_id, top_k=top_k, include_metadata=True)
    return [res["metadata"]["text"] for res in results["matches"]]
