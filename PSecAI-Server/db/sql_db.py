import psycopg2
from config import DB_CONFIG

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def save_report_metadata(user_id, filename):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO reports (user_id, filename) VALUES (%s, %s)", (user_id, filename))
    conn.commit()
    cur.close()
    conn.close()
