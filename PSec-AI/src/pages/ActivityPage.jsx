import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { FaCog, FaUser } from 'react-icons/fa';
import '../styles/ActivityPage.css';
import { useNavigate } from 'react-router-dom';

const ActivityPage = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [showHeading, setShowHeading] = useState(true); 
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    const handleLogoClick = () =>{
        navigate('/');
    }

    const handleGenerateClick = () => {
        if (!query.trim()) return; // Ignore empty input

        setLoading(true);
        const userMessage = { text: query, sender: 'user' };

        // Test Fake AI response with a delay
        setTimeout(() => {
            const aiMessage = { text: `Generated report for: "${query}"`, sender: 'ai' };

            setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
            setLoading(false);
        }, 2000);

        setQuery('');
        setShowHeading(false); 
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleGenerateClick();
        } else if (event.key === 'Enter' && event.shiftKey) {
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
                    <div className="profile-option">
                    <FaUser className='option-icon'/>
                    </div>
                </div>
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
                    <button className="AiGenerate-button" onClick={handleGenerateClick}>
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;
