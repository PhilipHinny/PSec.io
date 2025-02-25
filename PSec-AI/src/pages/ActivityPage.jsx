import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ReportHeader from '../components/ReportHeader';
import '../styles/ActivityPage.css';

const ActivityPage = () => {
    const [query, setQuery] = useState('');

    const handleGenerate = () => {
        // Simulate generating results
        console.log(`${query}`);
    };

    return (
        <div className="Activity-container">
            <div className="leftsideTab">
                <Sidebar />
                <ReportHeader />
            </div>
            <div className="chat-body">
                <h2 className="chat-heading">What Report are we doing today?</h2>
                <div className="search-box">
                    <textarea
                        placeholder="Ask anything"
                        className="search-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="AiGenerate-button" onClick={handleGenerate}>Generate</button>
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;
