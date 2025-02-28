import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { FaCog, FaUser, FaDownload } from 'react-icons/fa';
import '../styles/ActivityPage.css';
import { Document, Packer, Paragraph, TextRun } from "docx";
import saveAs from "file-saver";
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

const ActivityPage = ({ user, onLoginSuccess, onLogout }) => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [showHeading, setShowHeading] = useState(true); 
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleLoginClick = () => {
        setShowLoginPopup(true);  // Show login popup
    };

    const handleClosePopup = () => {
        setShowLoginPopup(false);  // Close login popup
    };

    const toggleDropdown = () => {
        setShowDropdown(prevState => !prevState);  // Toggle the dropdown visibility
    };

    const handleGenerateClick = () => {
        if (!query.trim()) return;

        setLoading(true);
        const userMessage = { text: query, sender: 'user' };

        // Fake AI response with a delay
        setTimeout(() => {
            const aiMessage = { text: `Generated report for: "${query}"`, sender: 'ai' };

            setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
            setLoading(false);
        }, 2000);

        setQuery('');
        setShowHeading(false); 
    };

    const handleDownloadClick = () => {
        if (messages.length === 0) return;
        const recentMessage = messages[messages.length - 1];
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: recentMessage.text,
                                    font: 'Times New Roman',
                                    size: 14 * 2,
                                }),
                            ],
                        }),
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "Report.docx");
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleGenerateClick();
        }
    };

    return (
        <div className="Activity-container">
            <Sidebar />

            {/* Header with logo, title, and profile */}
            <header className="app-header">
                <div className="logo" onClick={handleLogoClick}>PSec AI</div>
                <div className="profile">
                    <div className="settings-option">
                        <FaCog className='option-icon'/>
                    </div>
                    <div className="profile-option" onClick={user ? toggleDropdown : handleLoginClick}>
                        {user ? (
                            <img 
                                src={user.photoURL || "https://www.example.com/default-profile-image.jpg"} 
                                alt="Profile" 
                                className="profile-img" 
                            />
                        ) : (
                            <FaUser className='option-icon'/>
                        )}
                    </div>
                    {/* Dropdown Menu */}
                    {showDropdown && user && (
                        <div className="dropdown-menu">
                            <button onClick={onLogout}>Logout</button>
                        </div>
                    )}
                </div>
                {showLoginPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <Login handleClose={handleClosePopup} onLoginSuccess={onLoginSuccess} />
                        </div>
                    </div>
                )}
            </header>

            <div className="chat-body">
                <div className="chat-content">
                    {messages.map((msg, index) => (
                        <p key={index} className={`chat-message ${msg.sender}`}>
                            {msg.text}
                        </p>
                    ))}
                    {loading && <p className="chat-message ai">Generating...</p>}
                    <div ref={chatEndRef} />
                </div>

                {showHeading && <h2 className="chat-heading">Generate Your Report</h2>}

                <div className="search-box">
                    <textarea
                        className="search-input"
                        placeholder="Ask anything"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button 
                        className="AiGenerate-button" 
                        onClick={user ? handleGenerateClick : handleLoginClick}
                    >
                        Generate
                    </button>
                    {messages.length > 0 && !loading && (
                        <button className="download-button" onClick={handleDownloadClick}>
                            <FaDownload />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;
