import { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaCog, FaCreditCard, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/BillingPage.css";

const BillingPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const defaultProfileImage = "https://www.example.com/default-profile-image.jpg";

  const [currentPlan, setCurrentPlan] = useState(null);
  const [amount, setAmount] = useState(0);

  // State for selected plan from plan selector
  const [selectedPlan, setSelectedPlan] = useState(null);

  // State to toggle plan selector visibility (for change plan)
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  // Example plans array (adjust as needed)
  const plans = [
    { id: "basic", name: "Basic Plan", price: "500 KES", features: "Feature A, Feature B" },
    { id: "premium", name: "Premium Plan", price: "1500 KES", features: "Feature A, Feature B, Feature C" },
    { id: "enterprise", name: "Enterprise Plan", price: "3000 KES", features: "All Features" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCurrentPlan = async () => {
      try {
        const response = await fetch("");
        const data = await response.json();
        console.log("Fetched plan data:", data);

        if (data && data.price) {
          setCurrentPlan(data);
          const price = parseFloat(data.price.replace(/[^0-9.]/g, ""));
          if (!isNaN(price)) {
            setAmount(price);
          }
        } else {
          // No active plan, hide currentPlan and show selector
          setCurrentPlan(null);
          setShowPlanSelector(true);
        }
      } catch (error) {
        console.error("Error fetching current plan:", error);
        // Show plan selector if error or no plan found
        setCurrentPlan(null);
        setShowPlanSelector(true);
      }
    };

    fetchCurrentPlan();
  }, []);

  const loadPaystackScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("paystack-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "paystack-script";
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const generateUniqueReference = () => {
  return 'ref_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
};


  const handlePayNow = async () => {
    if (!user?.email) {
      alert("User email not found, please log in.");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Invalid payment amount.");
      return;
    }

    // Generate unique reference for this transaction
  const uniqueReference = generateUniqueReference();

    const payload = {
      email: user.email,
      amount: parseFloat(amount),
      currency: "KES",
      reference: uniqueReference,
    };

    console.log("Sending payment initialization payload:", payload);

    try {
      const response = await fetch("http://127.0.0.1:5000/paystack/initialize-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Payment initialization failed: ${data.error || "Unknown error"}`);
        return;
      }

      const scriptLoaded = await loadPaystackScript();
      if (!scriptLoaded) {
        alert("Failed to load Paystack script. Please try again later.");
        return;
      }

      openPaystackPopup({ ...data, currency: "KES" });
    } catch (error) {
      console.error("Error initializing payment:", error);
      alert("An error occurred while initializing payment.");
    }
  };

  const openPaystackPopup = ({ reference, paystackPublicKey, currency }) => {
    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email: user.email,
      amount: amount,
      currency: currency,
      ref: reference,
      onClose: () => {
        alert("Payment popup closed.");
      },
      callback: (response) => {
        alert(`Payment successful. Reference: ${response.reference}`);
      },
    });

    handler.openIframe();
  };

  const handleChangePlanClick = () => {
    setShowPlanSelector(true);
    setSelectedPlan(null);
    setAmount(0);
  };

  return (
    <div className="dashboard-container">
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

      <div className="main-content">
        <header className="header">
          <button className="upload-button" onClick={() => navigate("/UploadPage")}>
            Upload
          </button>
          <div className="user-icon">
            <img src={user?.photoURL || defaultProfileImage} alt="Profile" className="profile-img" />
          </div>
        </header>

        <div className="billing-content">
          <h1 className="page-title">Billing & Plans</h1>

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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Basic Plan</td>
                      <td>Feature A, Feature B</td>
                      <td>500 KES</td>
                      <td>2023-12-31</td>
                      <td>
                        <button className="change-plan-button" onClick={handleChangePlanClick}>
                          Change Plan
                        </button>
                      </td>
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
          </div>
          
          {/* Show Plan Selector if no active plan or user clicked "Change Plan" */}
          {showPlanSelector && (
            <div className="section">
              <h2 className="section-title">Select a Plan</h2>
              <select
                className="plan-selector"
                value={selectedPlan ? selectedPlan.id : ""}
                onChange={(e) => {
                  const plan = plans.find((p) => p.id === e.target.value);
                  setSelectedPlan(plan);
                  if (plan) {
                    const price = parseFloat(plan.price.replace(/[^0-9.]/g, ""));
                    setAmount(price);
                  }
                }}
              >
                <option value="" disabled>
                  -- Select a plan --
                </option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {plan.price}
                  </option>
                ))}
              </select>
              {selectedPlan && (
                <div className="selected-plan-details">
                  <p>
                    <strong>Features:</strong> {selectedPlan.features}
                  </p>
                  <p>
                    <strong>Price:</strong> {selectedPlan.price}
                  </p>
                </div>
              )}

              {selectedPlan && (
                <button className="update-button" onClick={handlePayNow}>
                  Pay Now
                </button>
              )}
            </div>
          )}

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
