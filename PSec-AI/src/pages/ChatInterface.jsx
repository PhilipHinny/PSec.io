import React from "react";
import { Globe, MessageSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";
import "./ChatInterface.css";

const reports = [
  { name: "External Intel", description: "External report" },
  { name: "Brand Pulse", description: "Marketing report" },
  { name: "Insights Unlocked", description: "Analytical reports" },
  { name: "The Blueprint", description: "Proposals strategies" },
];

const ChatInterface = () => {
  return (
    <div className="chat-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <button className="sidebar-btn" aria-label="Navigate to home">
              <MessageSquare className="icon" /> PSec.IO
            </button>
          </div>
          <nav className="sidebar-nav">
            <h2 className="sidebar-title">Today</h2>
            <ul className="sidebar-list">
              <li><Link to="/chat/q3-report">Q3 Activity Report</Link></li>
              <li><Link to="/chat/marketing-overview">Marketing Overview</Link></li>
            </ul>
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1 className="header-title">PSec.IO</h1>
          <button className="profile-btn" aria-label="Profile">PH</button>
        </header>
        <div className="chat-body">
          <h2 className="chat-heading">What Report are we doing today?</h2>
          <div className="search-box">
            <input type="text" placeholder="Ask anything" className="search-input" />
            <button className="icon-btn" aria-label="Search"><Search className="icon" /></button>
            <button className="icon-btn" aria-label="Global search"><Globe className="icon" /></button>
          </div>
          <div className="options-grid">
            {reports.map((report, index) => (
              <button key={index} className="option-btn">
                <div>{report.name}</div>
                <span>{report.description}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
