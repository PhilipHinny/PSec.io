import React from "react";
import { 
  FaHome, 
  FaFileAlt, 
  FaCog, 
  FaCreditCard, 
  FaQuestionCircle, 
  FaUser, 
  FaSignOutAlt 
} from "react-icons/fa";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
        <div className="sidebar">
          <div className="Dashboard-logo">
            <div className="Dashboard-logo-icon">
          <img src="/PsecIcon.png" alt="Logo" className="logo-image" />
          </div>
          <h2>PSec Ai</h2>
        </div>
        <nav className="nav-menu">
          <div className="nav-item" onClick={() => navigate('/Dashboard')}><FaHome /> Dashboard</div>
          <div className="nav-item" onClick={() => navigate('/MyDocumentPage')}><FaFileAlt /> My Documents</div>
          <div className="nav-item"><FaCog /> Account Settings</div>
          <div className="nav-item"><FaCreditCard /> Billing & Plan</div>
          <div className="nav-item"><FaQuestionCircle /> Help/Support</div>
          <div className="logout-container nav-item"><FaSignOutAlt /> Log out</div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <button className="upload-button" onClick={() => navigate("/UploadPage")}>
            Upload
          </button>
          <div className="user-icon">
            <FaUser size={20} />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-container">
            <StatCard title="Reports Uploaded" count={5} label="Documents" colorClass="green-count" />
            <StatCard title="Reports Generated" count={8} label="Documents" colorClass="blue-count" />
            <StatCard title="Reports Downloaded" count={5} label="Documents" colorClass="green-count" />
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <h2 className="section-title">Recent Activity</h2>
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th>Date/Time</th>
                  <th>Document Name</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <ActivityRow date="27 Feb, 2025, 10:30PM" document="Q1 Performance Report" action="Generated" status="Successful" />
                <ActivityRow date="27 Feb, 2025, 10:30PM" document="Q2 Performance Report" action="Downloaded" status="Successful" />
                <ActivityRow date="27 Feb, 2025, 10:30PM" document="Q2 Performance Report" action="Downloaded" status="Successful" />
              </tbody>
            </table>
          </div>

          {/* Report Generation History */}
          <div className="history-section">
            <h2 className="section-title">Report Generation History</h2>
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th>Date/Time</th>
                  <th>Document Name</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <HistoryRow date="27 Feb, 2025, 10:30PM" document="Q2 Performance Report" type="Personal" />
                <HistoryRow date="27 Feb, 2025, 10:30PM" document="Annual Sales Report" type="Sales" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, count, label, colorClass }) => {
  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <div className="stat-value">
        <span className={colorClass}>{count}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
};

// Activity Row Component
const ActivityRow = ({ date, document, action, status }) => {
  return (
    <tr className="table-row">
      <td>{date}</td>
      <td>{document}</td>
      <td>{action}</td>
      <td>{status}</td>
    </tr>
  );
};

// History Row Component
const HistoryRow = ({ date, document, type }) => {
  return (
    <tr className="table-row">
      <td>{date}</td>
      <td>{document}</td>
      <td>{type}</td>
      <td>
        <a href="#" className="download-link">Download</a>
      </td>
    </tr>
  );
};

export default Dashboard;