import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';
import './styles/App.css';
import Login from './components/Login';
import Header from './components/Header';
import Policypage from './pages/Policypage';
import UploadPage from './pages/UploadPage';
import MyDocumentPage from './pages/MyDocumentPage';
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth imports

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App-container">
      <Router>
        <AppContent user={user} setUser={setUser} showLogin={showLogin} setShowLogin={setShowLogin} />
      </Router>
    </div>
  );
}

function AppContent({ user, setUser, showLogin, setShowLogin }) {
  const location = useLocation();

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleClose = () => {
    setShowLogin(false);
  };

  return (
    <>
      {location.pathname !== "/MyDocumentPage" && (
        <Header user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
      )}
      {showLogin && <Login handleClose={handleClose} onLoginSuccess={handleLoginSuccess} />}
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/activitypage" element={<ActivityPage user={user} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} handleClose={handleClose} />} />
        <Route path="/Policypage" element={<Policypage />} />
        <Route path="/uploadPage" element={<UploadPage user={user} />} />
        <Route path="/MyDocumentPage" element={<MyDocumentPage />} />
      </Routes>
    </>
  );
}

export default App;
