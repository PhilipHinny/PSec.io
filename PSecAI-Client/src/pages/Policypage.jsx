import React from 'react';
import '../styles/Policypage.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1 className="privacy-policy-title">Privacy Policy for Facebook Login</h1>

      <div className="privacy-policy-section">
        <h2>1. Introduction</h2>
        <p>Welcome to PSec AI ("we," "our," or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you sign in using Facebook.</p>
      </div>

      <div className="privacy-policy-section">
        <h2>2. Information We Collect</h2>
        <p>Your name</p>
        <p>Email address</p>
        <p>Profile picture (if available)</p>
        <p>Any additional information you provide during sign-up</p>
      </div>

      <div className="privacy-policy-section">
        <h2>3. How We Use Your Information</h2>
        <p>Authenticate your identity</p>
        <p>Provide you with access to our services</p>
        <p>Improve user experience</p>
        <p>Ensure account security and prevent fraud</p>
      </div>

      <div className="privacy-policy-section">
        <h2>4. Data Sharing and Security</h2>
        <p>We do not sell, trade, or rent your personal information.</p>
        <p>We use industry-standard security measures to protect your data.</p>
        <p>Your login credentials remain secure with Facebook; we do not store your passwords.</p>
      </div>

      <div className="privacy-policy-section">
        <h2>5. Third-Party Services</h2>
        <p>Our app integrates Facebook authentication services. You should review Facebook’s privacy policy for more details:</p>
        <a href="https://www.facebook.com/policy.php" target="_blank" rel="noopener noreferrer" className="privacy-policy-link">
          Facebook Privacy Policy
        </a>
      </div>

      <div className="privacy-policy-section">
        <h2>6. Your Rights and Choices</h2>
        <p>You can manage your authentication settings within your Facebook account.</p>
        <p>You can request to delete your account and associated data by contacting us at 
          <a href="mailto:psecai2025@gmail.com" className="privacy-policy-link"> psecai2025@gmail.com</a>.
        </p>
      </div>

      <div className="privacy-policy-section">
        <h2>7. Changes to This Policy</h2>
        <p>We may update this Privacy Policy periodically. We encourage you to review it regularly for any changes.</p>
      </div>

      <div className="privacy-policy-section contact-info">
        <h2>8. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>
          <a href="mailto:psecai2025@gmail.com">psecai2025@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
