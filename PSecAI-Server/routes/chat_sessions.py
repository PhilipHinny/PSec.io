from flask import Blueprint, request, jsonify
from database import get_db_connection
from datetime import datetime
import uuid

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/chat", methods=["POST"])
def save_chat():
    data = request.json
    user_id = data.get("user_id")
    session_id = data.get("session_id") or str(uuid.uuid4())
    messages = data.get("messages", [])
    title = data.get("title") or (messages[0]["text"] if messages else "Untitled")
    created_at = data.get("created_at") or datetime.utcnow()

    if not user_id or not messages:
        return jsonify({"error": "Missing user_id or messages"}), 400

    db = get_db_connection()
    chat_collection = db["ChatSessions"]

    chat_collection.update_one(
        {"user_id": user_id, "session_id": session_id},
        {"$set": {
            "messages": messages,
            "title": title,
            "created_at": created_at
        }},
        upsert=True
    )
    return jsonify({"session_id": session_id, "status": "saved"}), 200

@chat_bp.route("/chats", methods=["GET"])
def list_chats():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    db = get_db_connection()
    chat_collection = db["ChatSessions"]
    chats = list(chat_collection.find(
        {"user_id": user_id},
        {"_id": 0, "session_id": 1, "title": 1, "created_at": 1}
    ).sort("created_at", -1))
    return jsonify({"chats": chats}), 200

@chat_bp.route("/chat", methods=["GET"])
def get_chat():
    session_id = request.args.get("session_id")
    user_id = request.args.get("user_id")
    if not session_id or not user_id:
        return jsonify({"error": "Missing session_id or user_id"}), 400

    db = get_db_connection()
    chat_collection = db["ChatSessions"]
    chat = chat_collection.find_one(
        {"user_id": user_id, "session_id": session_id},
        {"_id": 0}
    )
    if not chat:
        return jsonify({"error": "Chat not found"}), 404
    return jsonify(chat), 200 