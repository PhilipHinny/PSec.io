import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ handleClose, onLoginSuccess }) {
  const googleProvider = new GoogleAuthProvider();
  // const facebookProvider = new FacebookAuthProvider();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const userCredential = await signInWithPopup(auth, googleProvider); 
      const user = userCredential.user; // Get the authenticated user
      onLoginSuccess(user); // Pass user data to the parent component
      setSuccess('Google login successful!');
      handleClose();
    } catch (error) {
      setError(error.message || 'An error occurred during Google login.');
    } finally {
      setLoading(false);
    }
  };

  // const handleFacebookClick = async () => {
  //   setError(null);
  //   setSuccess(null);
  //   setLoading(true);

  //   try {
  //     const userCredential = await signInWithRedirect(auth, facebookProvider); 
  //     const user = userCredential.user; // Get the authenticated user
  //     onLoginSuccess(user); // Pass user data to the parent component
  //     setSuccess('Facebook login successful!');
  //     handleClose();
  //   } catch (error) {
  //     setError(error.message || 'An error occurred during Facebook login.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="login-page">
      <div className="login-container">
        <FaTimes className="close-button" onClick={handleClose} />
        <h1 className="login-title">Sign Up for PSEC AI</h1>

        {/* Google Login Button */}
        <button className="loginIcon" onClick={handleGoogleClick} disabled={loading}>
          <img src='/google.png' alt='Google icon' />
          {loading ? 'Logging in...' : 'Sign in with Google'}
        </button>

        {/* Facebook Login Button
        <button className="loginIcon" onClick={handleFacebookClick} disabled={loading}>
          <img src='/facebook.png' alt='Facebook icon' />
          {loading ? 'Logging in...' : 'Sign in with Facebook'}
        </button> */}

        {/* X (Twitter) Login Button */}
        <button className="loginIcon">
          <img src='/twitter.png' alt='X icon' />
          Sign in with X
        </button>

        {/* Display any error or success message */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );
}

export default Login;
