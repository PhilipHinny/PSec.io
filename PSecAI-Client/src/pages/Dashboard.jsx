import React from "react";
import { FaHome, FaFileAlt, FaCog, FaCreditCard, FaQuestionCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import RecentActivity from "../components/RecentActivity";
import ReportGenerationHistory from "../components/ReportGenerationHistory";

const Dashboard = () => {

  const navigate = useNavigate();

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
          <div className="nav-item" onClick={() => navigate('/AccountSetting')}><FaCog /> Account Settings</div>
          <div className="nav-item"  onClick={() => navigate('/BillingPage')}><FaCreditCard /> Billing & Plan</div>
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
          <RecentActivity />

          {/* Report Generation History Table */}
          <ReportGenerationHistory />
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;