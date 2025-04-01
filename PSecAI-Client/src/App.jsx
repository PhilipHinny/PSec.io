import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';
import Login from './components/Login';
import Header from './components/Header';
import Policypage from './pages/Policypage';
import UploadPage from './pages/UploadPage';
import MyDocumentPage from './pages/MyDocumentPage';
import Dashboard from './pages/Dashboard';
import BillingPage from './pages/BillingPage';
import AccountSettings from './pages/AccountSetting';
import './styles/App.css';

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
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); 
      setUser(null); 
      navigate("/"); 
    } catch (error) {
      console.error("Logout error:", error); 
    }
  };

  const handleClose = () => {
    setShowLogin(false);
  };

  const handleLogoutAllDevices = async () => {
    const auth = getAuth();
    try {
      // Force refresh token to revoke the previous session
      await auth.currentUser?.getIdToken(true); 
      await signOut(auth); 
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out from all devices:", error);
    }
  };

  // Hide Header on specific pages
  const hideHeaderPages = ["/MyDocumentPage", "/Dashboard", "/BillingPage", "/AccountSetting"];
  const shouldShowHeader = !hideHeaderPages.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />}
      {showLogin && <Login handleClose={handleClose} onLoginSuccess={handleLoginSuccess} />}
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/activitypage" element={<ActivityPage user={user} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} handleClose={handleClose} />} />
        <Route path="/Policypage" element={<Policypage />} />
        <Route path="/Dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
        <Route path="/uploadPage" element={<UploadPage user={user} />} />
        <Route path="/MyDocumentPage" element={<MyDocumentPage user={user} onLogout={handleLogout} />} />
        <Route path="/BillingPage" element={<BillingPage user={user} onLogout={handleLogout} />} />
        <Route
          path="/AccountSetting"
          element={<AccountSettings user={user} onLogout={handleLogout} LogoutAll={handleLogoutAllDevices} />}
        />
      </Routes>
    </>
  );
}


export default App;