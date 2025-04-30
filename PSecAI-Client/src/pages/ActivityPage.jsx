import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaUser, FaDownload, FaSignOutAlt, FaFileAlt, FaBell, FaLock, FaSlidersH, FaTachometerAlt } from 'react-icons/fa';
import { Document, Packer, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";
import saveAs from "file-saver";
import Sidebar from '../components/Sidebar';
import Login from '../components/Login';
import '../styles/ActivityPage.css';

const ActivityPage = ({ user, onLoginSuccess, onLogout }) => {
    // State Variables
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showHeading, setShowHeading] = useState(true);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState('pdf');
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    // Navigation Handlers
    const handleLogoClick = () => navigate('/');
    const handleLoginClick = () => setShowLoginPopup(true);
    const handleClosePopup = () => setShowLoginPopup(false);

    // Dropdown Toggles
    const toggleDropdown = () => setShowDropdown(prevState => !prevState);
    const toggleSettingsDropdown = () => setShowSettingsDropdown(prevState => !prevState);

    // Generate Report
    const handleGenerateClick = async () => {
        if (!query.trim()) return;
        setLoading(true);

        try {
            const response = await fetch("http://192.168.0.105:5000/generate_report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user?.uid || "test_user",
                    prompt: query
                })
            });

            if (!response.ok) throw new Error(`Request failed: ${await response.text()}`);

            const result = await response.json();
            if (result.generated_report) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: query, sender: 'user' },
                    { text: result.generated_report, sender: 'ai' }
                ]);
            } else {
                throw new Error("Empty response from AI");
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

    // Download Report
    const handleDownloadClick = async (format) => {
        if (messages.length === 0) return;

        const recentMessage = messages[messages.length - 1];
        const reportText = recentMessage.text.trim();

        try {
            if (format === "pdf") {
                const doc = new jsPDF();
                doc.setFont("Times New Roman");
                let yPosition = 20;
                const lineHeight = 10;

                const sections = reportText.split(/\n(?=[A-Z])/);
                sections.forEach((section, index) => {
                    if (index === 0) {
                        doc.setFontSize(18).setFont(undefined, "bold").text(section.trim(), 105, yPosition, { align: "center" });
                    } else {
                        doc.setFontSize(16).setFont(undefined, "bold").text(section.trim(), 10, yPosition);
                    }
                    yPosition += lineHeight * 2;
                });

                doc.save("Formatted_Report.pdf");
            } else if (format === "docx") {
                const doc = new Document({
                    sections: [
                        {
                            properties: {},
                            children: reportText.split("\n").map((line) =>
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: line.trim(),
                                            bold: /^[A-Z]/.test(line),
                                        }),
                                    ],
                                    spacing: { after: 200 },
                                })
                            ),
                        },
                    ],
                });

                const blob = await Packer.toBlob(doc);
                saveAs(blob, "Formatted_Report.docx");
            }
        } catch (error) {
            console.error("Error formatting the document:", error);
            alert("There was an error trying to format the document.");
        }
    };

    // Scroll to the latest message
    useEffect(() => {
        window.scrollTo(0, 0);
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle Enter Key Press
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
                    <div className="settings-option" onClick={toggleSettingsDropdown}>
                        <FaCog className='option-icon' />
                        {showSettingsDropdown && (
                            <div className="dropdown-menu">
                                <button onClick={() => navigate('/settings')}><FaSlidersH /> General Settings</button>
                                <button onClick={() => navigate('/notifications')}><FaBell /> Notifications</button>
                                <button onClick={() => navigate('/privacy')}><FaLock /> Privacy</button>
                            </div>
                        )}
                    </div>
                    <div className="profile-option" onClick={user ? toggleDropdown : handleLoginClick}>
                        {user ? (
                            <img
                                src={user.photoURL || defaultProfileImage}
                                alt="Profile"
                                className="profile-img"
                            />
                        ) : (
                            <FaUser className='option-icon' />
                        )}
                        {showDropdown && user && (
                            <div className="dropdown-menu">
                                <button onClick={() => navigate('/Dashboard')}><FaTachometerAlt /> Dashboard</button>
                                <button onClick={() => navigate('/Policypage')}><FaFileAlt /> Policy</button>
                                <button onClick={onLogout}><FaSignOutAlt /> Logout</button>
                            </div>
                        )}
                    </div>
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
                    {messages.map((msg, index) => {
                        if (msg.sender === 'ai') {
                            const sections = msg.text.split("**").filter((section) => section.trim() !== "");
                            return sections.map((section, i) => {
                                const [title, content] = section.split(":");
                                return (
                                    <div key={i} className="chat-message ai">
                                        {title && <strong className="chat-section-title">{title.trim()}</strong>}
                                        {content && <p className="chat-section-content">{content.trim()}</p>}
                                    </div>
                                );
                            });
                        }
                        return <p key={index} className={`chat-message ${msg.sender}`}>{msg.text}</p>;
                    })}
                    {loading && <p className="chat-message ai">Generating...</p>}
                    <div ref={chatEndRef} />
                </div>

                {showHeading && <h2 className="chat-heading">Generate Your Report</h2>}

                <div className="search-box">
                    <textarea
                        className="chat-search-input"
                        placeholder="Ask anything"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="AiGenerate-button" onClick={user ? handleGenerateClick : handleLoginClick}>
                        Generate
                    </button>

                    {messages.length > 0 && !loading && (
                        <>
                            <select
                                className="download-format-select"
                                value={downloadFormat}
                                onChange={(e) => setDownloadFormat(e.target.value)}
                            >
                                <option value="pdf">PDF</option>
                                <option value="docx">DOCX</option>
                            </select>

                            <button className="download-button" onClick={() => handleDownloadClick(downloadFormat)}>
                                <FaDownload />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;
