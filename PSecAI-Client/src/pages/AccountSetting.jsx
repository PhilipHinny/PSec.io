import React, { useState } from "react";
import { FaHome, FaFileAlt, FaCog, FaCreditCard, FaQuestionCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import "../styles/Accountsetting.css"; // Import your CSS file for styling
import { useNavigate } from "react-router-dom";


const AccountSettings = () => {
    
  const navigate = useNavigate();
  const [reportFormat, setReportFormat] = useState("pdf");

  return (
    <div className="page-container">
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

        {/* Account Settings Content */}
        <div className="settings-content">
          <h1 className="page-title">Account Settings</h1>
          
          {/* Profile Information */}
          <div className="profile-section">
            <div className="profile-picture">
              <img src="/images.png" alt="Profile" />
            </div>
            
            <div className="profile-fields">
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input 
                  type="text" 
                  className="field-input" 
                  value="Kasy Jonan" 
                  readOnly 
                />
              </div>
              
              <div className="field-group">
                <label className="field-label">Email</label>
                <input 
                  type="email" 
                  className="field-input" 
                  value="kasyjonan@gmail.com" 
                  readOnly 
                />
              </div>
              
              <div className="field-group">
                <label className="field-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="field-input" 
                  value="0704361827" 
                  readOnly 
                />
              </div>
            </div>
          </div>
          
          {/* Password & Security */}
          <div className="section">
            <h2 className="section-title">Password & Security</h2>
            <p className="section-subtitle">Change Password</p>
            
            <div className="password-fields">
              <input 
                type="password" 
                className="password-input" 
                placeholder="Old Password" 
              />
              <input 
                type="password" 
                className="password-input" 
                placeholder="New Password" 
              />
              <input 
                type="password" 
                className="password-input" 
                placeholder="Confirm New Password" 
              />
            </div>
          </div>
          
          {/* Two-Factor Authentication */}
          <div className="section">
            <h2 className="section-title">Two-Factor Authentication</h2>
            <button className="enable-button">
              Enable
            </button>
          </div>
          
          {/* Report Preferences */}
          <div className="section">
            <h2 className="section-title">Report Preferences</h2>
            <div className="format-options">
              <label className="format-option">
                <input 
                  type="radio" 
                  name="format" 
                  value="pdf" 
                  checked={reportFormat === "pdf"} 
                  onChange={() => setReportFormat("pdf")} 
                />
                <span className={`format-radio ${reportFormat === "pdf" ? "selected" : ""}`}></span>
                <span className="format-label">PDF</span>
              </label>
              
              <label className="format-option">
                <input 
                  type="radio" 
                  name="format" 
                  value="docx" 
                  checked={reportFormat === "docx"} 
                  onChange={() => setReportFormat("docx")} 
                />
                <span className={`format-radio ${reportFormat === "docx" ? "selected" : ""}`}></span>
                <span className="format-label">DOCX</span>
              </label>
              
              <label className="format-option">
                <input 
                  type="radio" 
                  name="format" 
                  value="txt" 
                  checked={reportFormat === "txt"} 
                  onChange={() => setReportFormat("txt")} 
                />
                <span className={`format-radio ${reportFormat === "txt" ? "selected" : ""}`}></span>
                <span className="format-label">TXT</span>
              </label>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="logout-all-button">
              Logout from All Devices
            </button>
            <button className="save-button">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AccountSettings;