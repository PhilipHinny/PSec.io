import { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaCog, FaCreditCard, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Accountsetting.css";

const AccountSettings = ({ user, onLogout, LogoutAll }) => {
  const navigate = useNavigate();
  const defaultProfileImage = "https://www.example.com/default-profile-image.jpg";
  const [reportFormat, setReportFormat] = useState("pdf");

  const [profile, setProfile] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="Dashboard-logo" onClick={() => navigate('/')}>
          <div className="Dashboard-logo-icon">
            <img src="/PsecIcon.png" alt="Logo" className="logo-image" />
          </div>
          <h2>PSec Ai</h2>
        </div>
        <nav className="nav-menu">
          <div className="nav-item" onClick={() => navigate('/Dashboard')}>
            <FaHome /> Dashboard
          </div>
          <div className="nav-item" onClick={() => navigate('/MyDocumentPage')}>
            <FaFileAlt /> My Documents
          </div>
          <div className="nav-item" onClick={() => navigate('/AccountSetting')}>
            <FaCog /> Account Settings
          </div>
          <div className="nav-item" onClick={() => navigate('/BillingPage')}>
            <FaCreditCard /> Billing & Plan
          </div>
          <div className="nav-item">
            <FaQuestionCircle /> Help/Support
          </div>
          <div className="logout-container nav-item" onClick={onLogout}>
            <FaSignOutAlt /> Log out
          </div>
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
            <img
              src={user?.photoURL || defaultProfileImage}
              alt="Profile"
              className="profile-img"
            />
          </div>
        </header>

        {/* Account Settings Content */}
        <div className="settings-content">
          <h1 className="page-title">Account Settings</h1>

          {/* Profile Information */}
          <div className="profile-section">
            <div className="profile-picture">
              <img
                src={user?.photoURL || defaultProfileImage}
                alt="Profile"
                className="profile-img"
              />
            </div>

            <div className="profile-fields">
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input
                  type="text"
                  className="field-input"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  readOnly
                />
              </div>

              <div className="field-group">
                <label className="field-label">Email</label>
                <input
                  type="text"
                  className="field-input"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  readOnly
                />
              </div>

              <div className="field-group">
                <label className="field-label">Phone Number</label>
                <input
                  type="text"
                  className="field-input"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          {/* Account Recovery */}
          <div className="section">
            <h2 className="section-title">Account Recovery</h2>
            <p className="section-subtitle">Manage your recovery options</p>

            <div className="recovery-fields">
              <input
                type="text"
                className="recovery-input"
                placeholder="Recovery Email (optional)"
              />
              <input
                type="text"
                className="recovery-input"
                placeholder="Recovery Phone Number (optional)"
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="section">
            <h2 className="section-title">Notification Preferences</h2>
            <div className="notification-options">
              <label>
                <input
                  type="checkbox"
                  // Add functionality to enable/disable notifications
                />
                <span>Enable Email Notifications</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  // Add functionality to enable/disable push notifications
                />
                <span>Enable Push Notifications</span>
              </label>
            </div>
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
            <button className="logout-all-button" onClick={LogoutAll}>
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