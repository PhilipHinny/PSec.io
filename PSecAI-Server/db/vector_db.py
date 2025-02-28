import pinecone
from config import PINECONE_API_KEY, PINECONE_INDEX_NAME
from langchain.embeddings import OpenAIEmbeddings

pinecone.init(api_key=PINECONE_API_KEY, environment="us-west1-gcp")
vector_db = pinecone.Index(PINECONE_INDEX_NAME)

def store_report(user_id, report_text):
    embedding = OpenAIEmbeddings().embed_query(report_text)
    vector_db.upsert([(user_id, embedding, {"text": report_text})])

def retrieve_reports(user_id, top_k=5):
    results = vector_db.query(user_id, top_k=top_k, include_metadata=True)
    return [res["metadata"]["text"] for res in results["matches"]]
