import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import "../styles/Sidebar.css";
import axios from "axios"; 
import API_BASE_URL from '../apiConfig';

const Sidebar = ({ user, onSelectChat, onNewChat }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (!user?.uid) return;
        // Fetch chat sessions from the backend
        const fetchChats = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/chats?user_id=${user.uid}`);
                setChats(response.data.chats || []);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        fetchChats();
    }, [user]);

    // Listen for new chat meta from ActivityPage
    useEffect(() => {
        window.onNewChatMeta = (meta) => {
            setChats((prev) => {
                if (prev.some(chat => chat.session_id === meta.session_id)) return prev;
                return [meta, ...prev];
            });
        };
        return () => { window.onNewChatMeta = null; };
    }, []);

    // Remove duplicates by session_id before rendering
    const uniqueChats = [];
    const seen = new Set();
    for (const chat of chats) {
        if (!seen.has(chat.session_id)) {
            uniqueChats.push(chat);
            seen.add(chat.session_id);
        }
    }

    return (
        <div className="chat-sidebar-container">
            <div className="chat-sidebar-header">
                <h2>Recent Chats</h2>
                <FaSearch className="sidebar-search-icon" />
                <button className="new-chat-btn" onClick={onNewChat} title="New Chat">
                    <FaPlus /> New Chat
                </button>
            </div>
            <div className="report-list">
                {uniqueChats.length > 0 ? (
                    uniqueChats.map((chat) => (
                        <button key={chat.session_id} className="report-item" onClick={() => onSelectChat && onSelectChat(chat.session_id)}>
                            <div className="report-title">{chat.title}</div>
                            <div className="report-date">{new Date(chat.created_at).toLocaleString()}</div>
                        </button>
                    ))
                ) : (
                    <div className="no-reports">No chats found</div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
