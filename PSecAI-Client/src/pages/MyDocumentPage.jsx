import React from 'react';
import '../styles/DocumentDashboard.css'; 
import { FaHome, FaFileAlt, FaCog, FaCreditCard, FaQuestionCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReportGenerationHistory from '../components/ReportGenerationHistory';
import DocumentUploaded from '../components/DocumentUploaded';


function DocumentDashboard() {

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
                  <div className="nav-item " onClick={() => navigate('/Dashboard')}><FaHome /> Dashboard</div>
                  <div className="nav-item " onClick={() => navigate('/MyDocumentPage')}><FaFileAlt /> My Documents</div>
                  <div className="nav-item " onClick={() => navigate('/AccountSetting')}><FaCog /> Account Settings</div>
                  <div className="nav-item " onClick={() => navigate('/BillingPage')}><FaCreditCard /> Billing & Plan</div>
                  <div className="nav-item "><FaQuestionCircle /> Help/Support</div>
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

        <div className="content">
          <h1>My Documents</h1>

          <div className="filters">
            <div className="search-container">
              <i className="search-icon"></i>
              <input type="text" placeholder="Search document" className="search-input" />
            </div>

            <div className="dropdown-filters">
              <div className="filter-dropdown">
                <span>Last 7 days</span>
                <i className="dropdown-icon"></i>
              </div>

              <div className="filter-dropdown">
                <span>Downloaded</span>
                <i className="dropdown-icon"></i>
              </div>
            </div>
          </div>

          {/* Document Uploaded Table */}
          <DocumentUploaded />

          {/* Report Generation History Table */}
          <ReportGenerationHistory />
          
        </div>
      </div>
    </div>
  )
}

export default DocumentDashboard

