import { useEffect } from "react";
import { FaHome, FaFileAlt, FaCog, FaCreditCard, FaQuestionCircle, FaSignOutAlt,} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/BillingPage.css";

const BillingPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const defaultProfileImage = "https://www.example.com/default-profile-image.jpg";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <div className="nav-item" onClick={() => navigate("/Dashboard")}>
            <FaHome /> Dashboard
          </div>
          <div className="nav-item" onClick={() => navigate("/MyDocumentPage")}>
            <FaFileAlt /> My Documents
          </div>
          <div className="nav-item" onClick={() => navigate("/AccountSetting")}>
            <FaCog /> Account Settings
          </div>
          <div className="nav-item" onClick={() => navigate("/BillingPage")}>
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

        {/* Billing Content */}
        <div className="billing-content">
          <h1 className="page-title">Billing & Plans</h1>

          {/* Current Plan Information */}
          <div className="section">
            <h2 className="section-title">Current Plan Information</h2>
            <div className="plan-table-container">
              <table className="plan-table">
                <thead>
                  <tr className="table-header">
                    <th>Plan</th>
                    <th>Features</th>
                    <th>Price</th>
                    <th>Next Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic</td>
                    <td>Basic report generation and analysis</td>
                    <td>$5/monthly</td>
                    <td>27 Mar, 2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="section">
            <h2 className="section-title">Payment Methods</h2>
            <div className="payment-methods">
              <div className="payment-icon">
                <img src="/mastercard.png" alt="MasterCard" className="payment-logo" />
              </div>
              <div className="payment-icon">
                <img src="/visa.png" alt="Visa" className="payment-logo" />
              </div>
              <div className="payment-icon">
                <img src="/apple.png" alt="Apple Pay" className="payment-logo" />
              </div>
            </div>

            {/* Card Details */}
            <div className="card-details">
              <h3 className="subsection-title">Card Details</h3>
              <div className="card-form">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="card-input card-number"
                />
                <input
                  type="text"
                  placeholder="Expiry Date"
                  className="card-input expiry-date"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="card-input cvv"
                />
                <button className="update-button">Update Payment Information</button>
              </div>
            </div>
          </div>

          {/* Cancellation Option */}
          <div className="section">
            <h2 className="section-title">Cancellation Option</h2>
            <p className="cancellation-text">
              You can cancel your subscription at any time through the Billing and Plans page.
              Once you cancel, you will continue to have access to your current plan until the
              end of your billing cycle, and you will not be charged for the next period.
            </p>
            <button className="cancel-button">Cancel Subscription</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;