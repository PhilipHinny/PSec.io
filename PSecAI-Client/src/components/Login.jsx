import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ handleClose, onLoginSuccess }) {
  const [accountType, setAccountType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); 

  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleClick = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
  
    if (!accountType) {
      setError('Please select Individual or Organization before signing in.');
      setLoading(false);
      return;
    }
  
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      await handleUserData(user);
  
      handleClose(); 
      navigate('/'); 
    } catch (error) {
      setError(error.message || 'An error occurred during Google login.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!accountType) {
      setError('Please select Individual or Organization before signing in.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Create user
        await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        await handleUserData(user);
        setSuccess('Account created successfully!');
      } else {
        // Sign in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await handleUserData(user);
        setSuccess('Login successful!');
      }

      navigate('/'); 

      handleClose(); // Close the login modal
    } catch (error) {
      setError(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserData = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        accountType,
        createdAt: new Date(),
      });
    } else {
      const existingType = docSnap.data().accountType;
      if (existingType !== accountType) {
        throw new Error(`You registered as ${existingType}. Please select the correct account type.`);
      }
    }

    onLoginSuccess(user, accountType); 

  };

  return (
    <div className="login-page">
      <div className="login-container">
        <FaTimes className="close-button" onClick={handleClose} />
        <h1 className="login-title">{isSignUp ? 'Sign Up' : 'Sign In'} to PSEC <span style={{color:"#2563eb"}}>AI</span></h1>

        <div className="account-type-select">
          <label className={`account-type-button ${accountType === 'individual' ? 'active' : ''}`}>
            <input type="radio" name="accountType" value="individual" onChange={(e) => setAccountType(e.target.value)} />
            Individual
          </label>
          <label className={`account-type-button ${accountType === 'organization' ? 'active' : ''}`}>
            <input type="radio" name="accountType" value="organization" onChange={(e) => setAccountType(e.target.value)} />
            Organization
          </label>
        </div>

        <form className="login-form" onSubmit={handleEmailPasswordAuth}>
          <input
            className="form-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <label className="Or-label">Or</label>

        <button className="loginIcon" onClick={handleGoogleClick} disabled={loading}>
          <img src="/google.png" alt="Google icon" />
          {loading ? 'Logging in...' : 'Sign in with Google'}
        </button>

        <div className="auth-toggle">
          <span>
            {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
            <button className='signup-button' onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? 'Sign in' : 'Sign up'}</button>
          </span>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );
}

export default Login;
