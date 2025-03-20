from config import PINECONE_INDEX_NAME, PINECONE_API_KEY  # Import PINECONE_API_KEY from config.py
from langchain_community.embeddings import OpenAIEmbeddings
import os
from pinecone import Pinecone, ServerlessSpec

# Use PINECONE_API_KEY from config.py instead of hardcoding
pc = Pinecone(api_key=PINECONE_API_KEY)

# Example: Create index if it doesn't exist
if PINECONE_INDEX_NAME not in pc.list_indexes().names():
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
    # Retrieve the vector for the user (this is an example, modify as needed)
    vector_to_query = get_vector_for_user(user_id)  # Implement this method to fetch the correct vector

    # Query Pinecone with keyword arguments
    results = vector_db.query(
        vector=vector_to_query,
        top_k=top_k,
        include_metadata=True
    )

    # Extract the report text from the query results
    return [res["metadata"]["text"] for res in results["matches"]]

def get_vector_for_user(user_id):
    # This function should return the vector for a given user_id
    # For now, we're just returning a dummy vector. Replace with actual logic.
    return [0.1, 0.2, 0.3]  # Replace with actual logic to retrieve the user's vector

