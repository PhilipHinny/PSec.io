import psycopg2
from config import DB_CONFIG
from langchain_community.embeddings import OpenAIEmbeddings
from pinecone import Pinecone, ServerlessSpec

# Database Connection
def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def save_report_metadata(user_id, filename):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO reports (user_id, filename) VALUES (%s, %s)", (user_id, filename))
        conn.commit()

# Pinecone Setup
from config import PINECONE_INDEX_NAME, PINECONE_API_KEY

pc = Pinecone(api_key=PINECONE_API_KEY)

# Create index if it doesn't exist
existing_indexes = [index["name"] for index in pc.list_indexes()]
if PINECONE_INDEX_NAME not in existing_indexes:
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=1536,
        metric='euclidean',
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'
        )
    )

vector_db = pc.Index(PINECONE_INDEX_NAME)

def store_report(user_id, report_text):
    # Generate the embedding for the report text using OpenAI
    embedding = OpenAIEmbeddings().embed_query(report_text)
    
    # Upsert the embedding into the vector database
    vector_db.upsert([(user_id, embedding, {"text": report_text})])

def retrieve_reports(user_id, top_k=5):
    vector_to_query = get_vector_for_user(user_id)

    # Query Pinecone with keyword arguments
    results = vector_db.query(
        vector=vector_to_query,
        top_k=top_k,
        include_metadata=True
    )

    return [res["metadata"]["text"] for res in results["matches"]]

def get_vector_for_user(user_id):
    # Fetch user vector from Pinecone if it exists
    response = vector_db.query(vector=[0]*1536, top_k=1, filter={"user_id": user_id})
    if response["matches"]:
        return response["matches"][0]["vector"]
    return [0] * 1536  # Default vector if no data exists
