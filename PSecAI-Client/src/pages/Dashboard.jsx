import { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaCog, FaCreditCard, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import RecentActivity from "../components/RecentActivity";
import ReportGenerationHistory from "../components/ReportGenerationHistory";

const Dashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    uploadedCount: 0,
    generatedCount: 0,
  });
  const navigate = useNavigate();
  const defaultProfileImage = "https://www.example.com/default-profile-image.jpg";

  const StatCard = ({ title, count, label, colorClass }) => (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <div className="stat-value">
        <span className={colorClass}>{count}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );

  useEffect(() => {
    if (!user?.uid) return; // Wait until user is available

    const fetchReportStats = async () => {
      try {
        const response = await fetch(`http://100.92.188.87:5000/report-stats?user_id=${user.uid}`);
        const data = await response.json();
        if (response.ok) {
          setStats({
            uploadedCount: data.uploaded_count,
            generatedCount: data.generated_count,
          });
        } else {
          console.error("Error fetching report stats:", data.error);
        }
      } catch (error) {
        console.error("Error fetching report stats:", error);
      }
    };

    fetchReportStats();
  }, [user]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="Dashboard-logo" onClick={() => navigate("/")}>
          <div className="Dashboard-logo-icon">
            <img src="/PsecIcon.png" alt="Logo" className="logo-image" />
          </div>
          <h2>PSec Ai</h2>
        </div>
        <nav className="nav-menu">
          <div className="nav-item" onClick={() => navigate("/Dashboard")}><FaHome /> Dashboard</div>
          <div className="nav-item" onClick={() => navigate("/MyDocumentPage")}><FaFileAlt /> My Documents</div>
          <div className="nav-item" onClick={() => navigate("/AccountSetting")}><FaCog /> Account Settings</div>
          <div className="nav-item" onClick={() => navigate("/BillingPage")}><FaCreditCard /> Billing & Plan</div>
          <div className="nav-item"><FaQuestionCircle /> Help/Support</div>
          <div className="logout-container nav-item" onClick={onLogout}><FaSignOutAlt /> Log out</div>
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

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-container">
            <StatCard title="Reports Uploaded" count={stats.uploadedCount} label="Documents" colorClass="green-count" />
            <StatCard title="Reports Generated" count={stats.generatedCount} label="Documents" colorClass="blue-count" />
          </div>

          {/* Recent Activity */}
          <RecentActivity user={user}/>

          {/* Report Generation History Table */}
          <ReportGenerationHistory user={user} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
