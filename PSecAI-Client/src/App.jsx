import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';
import './styles/App.css';
import Login from './components/Login';
import Header from './components/Header';
import Policypage from './pages/Policypage';
import UploadPage from './pages/UploadPage';

function App() {
  const [user, setUser] = useState(null);  // Manage user state here

  // Handle login success
  const handleLoginSuccess = (userData) => {
    setUser(userData);  // Set logged-in user data
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);  // Clear user data on logout
  };

  return (
    <div className="App-container">
      <Router>
        <Header user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />  {/* Pass user to Home page */}
          <Route path="/activitypage" element={<ActivityPage user={user} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/Policypage" element={<Policypage />} />
          <Route path="/uploadPage" element={<UploadPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
