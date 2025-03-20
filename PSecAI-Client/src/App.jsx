import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';
import './styles/App.css';
import Login from './components/Login';
import Header from './components/Header';
import Policypage from './pages/Policypage';
import UploadPage from './pages/UploadPage';
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth imports

function App() {
  const [user, setUser] = useState(null);  // Manage user state here
  const [showLogin, setShowLogin] = useState(false); // Manage login modal visibility

  // Handle login success
  const handleLoginSuccess = (userData) => {
    setUser(userData);  // Set logged-in user data
    setShowLogin(false); // Close the login modal
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);  // Clear user data on logout
  };

  // Close the login modal
  const handleClose = () => {
    setShowLogin(false);
  };

  // Check for authenticated user on app load
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the logged-in user
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  return (
    <div className="App-container">
      <Router>
        <Header user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
        {showLogin && <Login handleClose={handleClose} onLoginSuccess={handleLoginSuccess} />}
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/activitypage" element={<ActivityPage user={user} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} handleClose={handleClose} />} />
          <Route path="/Policypage" element={<Policypage />} />
          <Route path="/uploadPage" element={<UploadPage user={user} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
