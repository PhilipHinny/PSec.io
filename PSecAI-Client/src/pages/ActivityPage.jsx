import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { FaCog, FaUser, FaDownload } from 'react-icons/fa';
import '../styles/ActivityPage.css';
import { Document, Packer, Paragraph, TextRun } from "docx";
import saveAs from "file-saver";
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import { jsPDF } from "jspdf";

const ActivityPage = ({ user, onLoginSuccess, onLogout }) => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [showHeading, setShowHeading] = useState(true); 
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState('pdf'); // Default format is PDF
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
            console.log("Sending request to backend...");
    
            const response = await fetch("http://127.0.0.1:5000/generate_report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user?.uid || "test_user", 
                    prompt: query
                })
            });
    
            console.log("Received response:", response);
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed: ${errorText}`);
            }
    
            const result = await response.json();
    
            if (result.generated_report) {
                const aiMessage = { text: result.generated_report, sender: 'ai' };
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: query, sender: 'user' },
                    aiMessage
                ]);
            } else {
                throw new Error("Empty response from AI");
            }
        } catch (error) {
            console.error("Report generation failed:", error);
            alert("Failed to generate the report. Check the console for errors.");
        } finally {
            setLoading(false);
            setQuery('');
            setShowHeading(false);
        }
    };

    const handleDownloadClick = (format) => {
        if (messages.length === 0) return;
    
        // Get the most recent message
        const recentMessage = messages[messages.length - 1];
        const reportText = recentMessage.text;
    
        try {
            // Split report by sections using a delimiter like "**" (customize as needed)
            const sections = reportText.split("**").filter((section) => section.trim() !== "");
    
            if (format === 'pdf') {
                // Generate PDF
                const doc = new jsPDF();
    
                // Title Section - Use the first section title or default to "Untitled Report"
                const title = sections[0]?.split(":")[0]?.trim() || "Untitled Report";
                doc.setFontSize(16);
                doc.setFont("helvetica", "bold");
                doc.text(title, 105, 20, null, null, "center");
    
                let yPosition = 30;  // Starting Y position for the content
                const lineHeight = 8;  // Line height to control vertical spacing
    
                sections.forEach((section) => {
                    const [title, content] = section.split(":");  // Assuming title and content are split by ":"
    
                    if (title && content) {
                        // Title of the section
                        doc.setFontSize(14);
                        doc.setFont("helvetica", "bold");
                        doc.text(title.trim(), 10, yPosition);
                        yPosition += lineHeight;
    
                        // Content of the section
                        doc.setFontSize(12);
                        doc.setFont("helvetica", "normal");
                        const contentLines = doc.splitTextToSize(content.trim(), 180); // Wrap text to 180px width
                        doc.text(contentLines, 10, yPosition);
                        yPosition += contentLines.length * lineHeight + 5;  // Adjust for content length and spacing
                    }
                });
    
                // Save the PDF with a specific name
                doc.save("Formatted_Report.pdf");
    
            } else if (format === 'docx') {
                // Generate DOCX using your existing code (as you already have)
                const doc = new Document({
                    sections: [
                        {
                            properties: {},
                            children: [
                                new Paragraph({
                                    text: sections[0]?.split(":")[0]?.trim() || "Untitled Report",
                                    heading: "Heading1",
                                    alignment: "center",
                                }),
                                ...sections.map((section) => {
                                    const [title, content] = section.split(":");
    
                                    if (title && content) {
                                        return [
                                            new Paragraph({
                                                text: title.trim(),
                                                bold: true,
                                                style: "Heading2",
                                            }),
                                            new Paragraph({
                                                text: content.trim(),
                                                style: "Normal",
                                                spacing: { after: 20 },
                                            }),
                                        ];
                                    }
                                    return null;
                                }).filter(Boolean),
                            ],
                        },
                    ],
                });
    
                Packer.toBlob(doc).then((blob) => {
                    saveAs(blob, "Formatted_Report.docx");  // Trigger download as DOCX
                });
    
            }
    
        } catch (error) {
            console.error("Error formatting the document:", error);
            alert("There was an error trying to format the document. Please check the console for details.");
        }
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
                    {messages.map((msg, index) => {
                        if (msg.sender === 'ai') {
                            const sections = msg.text.split("**").filter((section) => section.trim() !== "");
                            return sections.map((section, i) => {
                                const [title, content] = section.split(":");
                                return (
                                    <div key={i} className="chat-message ai">
                                        {title && <strong className="section-title">{title.trim()}</strong>}
                                        {content && <p className="section-content">{content.trim()}</p>}
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
