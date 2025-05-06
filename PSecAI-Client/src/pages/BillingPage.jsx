import { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaCog, FaCreditCard, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "../styles/BillingPage.css";

// Load your Stripe public key
const stripePromise = loadStripe("your-stripe-public-key-here");

const BillingPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const defaultProfileImage = "https://www.example.com/default-profile-image.jpg";
  
  // State to handle payment processing
  const [clientSecret, setClientSecret] = useState("");
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch the client secret for the PaymentIntent from your Flask backend
    const fetchClientSecret = async () => {
      const response = await fetch("http://192.168.0.115:5000/create-payment-intent", {  // Updated URL to match Flask route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);  // Set the client secret for Stripe
    };

    // Fetch the current plan information from the backend
    const fetchCurrentPlan = async () => {
      const response = await fetch("http://192.168.0.115:5000/get-current-plan", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCurrentPlan(data);  // Set current plan state
    };

    fetchClientSecret();
    fetchCurrentPlan();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (event, stripe, elements) => {
    event.preventDefault();

    if (!stripe || !elements) return;  // Ensure Stripe and Elements are loaded

    const paymentElement = elements.getElement(PaymentElement);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,  // Redirect URL after successful payment
      },
    });

    if (error) {
      console.error(error);
      alert(error.message);  // Show error message if the payment fails
    } else {
      alert('Payment successful!');  // Show success message
    }
  };

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
            <img src={user?.photoURL || defaultProfileImage} alt="Profile" className="profile-img" />
          </div>
        </header>

        {/* Billing Content */}
        <div className="billing-content">
          <h1 className="page-title">Billing & Plans</h1>

          {/* Current Plan Information */}
          <div className="section">
            <h2 className="section-title">Current Plan Information</h2>
            {currentPlan ? (
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
                      <td>{currentPlan.plan}</td>
                      <td>{currentPlan.features}</td>
                      <td>{currentPlan.price}</td>
                      <td>{currentPlan.next_payment_date}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Loading your current plan information...</p>
            )}
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

            {/* Stripe Payment Section */}
            <div className="stripe-section">
              <h3 className="subsection-title">Pay with Credit/Debit Card</h3>
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <form onSubmit={(e) => handleSubmit(e, useStripe(), useElements())}>
                    <PaymentElement />
                    <button
                      type="submit"
                      className="update-button"
                      disabled={!stripe || !clientSecret}
                    >
                      Pay Now
                    </button>
                  </form>
                </Elements>
              )}
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
