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
        setShowLoginPopup(true);
    };

    const handleClosePopup = () => {
        setShowLoginPopup(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(prevState => !prevState);
    };

    const handleGenerateClick = async () => {
        if (!query.trim()) return;
    
        setLoading(true);
    
        try {
            // Send a POST request to the backend
            const response = await fetch("http://127.0.0.1:5000/generate_report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user?.uid, 
                    prompt: query
                })
            });
    
            const result = await response.json();
    
            // If the response is successful, add the generated report
            if (response.ok) {
                const aiMessage = { text: result.generated_report, sender: 'ai' };
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: query, sender: 'user' },
                    aiMessage
                ]);
            } else {
                alert(result.error);  // Show any error message
            }
        } catch (error) {
            console.error("Report generation failed:", error);
            alert("Failed to generate the report.");
        } finally {
            setLoading(false);
            setQuery('');
            setShowHeading(false);
        }
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
            <header className="app-header">
                <div className="logo" onClick={handleLogoClick}>PSec AI</div>
                
                <div>
                    <button className='upload-button' onClick={user ? () => navigate('/UploadPage') : handleLoginClick}>
                        Upload Files
                    </button>
                </div>

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
