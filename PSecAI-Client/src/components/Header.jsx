import React, { useState } from 'react';
import '../styles/Header.css';
import { FaCog, FaUser, FaSignOutAlt, FaFileAlt, FaBell, FaLock, FaSlidersH, FaTachometerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

const Header = ({ user, onLoginSuccess, onLogout }) => {
    const navigate = useNavigate();
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

    const handleLogoClick = () => {
        navigate('/');
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
        const day = now.getDate();
        const year = now.getFullYear();
        const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });

        return `${weekday} ${day}, ${year} - ${time}`;
    };

    const handleLoginClick = () => {
        setShowLoginPopup(true);
    };

    const handleClosePopup = () => {
        setShowLoginPopup(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(prevState => !prevState);
    };

    const toggleSettingsDropdown = () => {
        setShowSettingsDropdown(prevState => !prevState);
    };

    const defaultProfileImage = "https://www.example.com/default-profile-image.jpg";

    return (
        <div className="header-container">
            <ul>
                <li className='logo' onClick={handleLogoClick}>PSec AI</li>
                <li className='Date-time-container'>{getCurrentDateTime()}</li>
                <li className='options'>
                    <div className="settings-option" onClick={toggleSettingsDropdown}>
                        <FaCog className='option-icon'/>
                        {showSettingsDropdown && (
                            <div className="dropdown-menu">
                                <button onClick={() => navigate('/settings')}><FaSlidersH /> General Settings</button>
                                <button onClick={() => navigate('/notifications')}><FaBell /> Notifications</button>
                                <button onClick={() => navigate('/privacy')}><FaLock /> Privacy</button>
                            </div>
                        )}
                    </div>
                    <div className="profile-option" onClick={user ? toggleDropdown : handleLoginClick}>
                        {user ? (
                            <img 
                                src={user.photoURL || defaultProfileImage} 
                                alt="Profile" 
                                className="profile-img" 
                            />
                        ) : (
                            <FaUser className='option-icon'/>
                        )}
                        {showDropdown && user && (
                            <div className="dropdown-menu">
                                <button onClick={() => navigate('/MyDocumentPage')}><FaTachometerAlt /> Dashboard</button>
                                <button onClick={() => navigate('/Policypage')}><FaFileAlt /> Policy</button>
                                <button onClick={onLogout}><FaSignOutAlt /> Logout</button>
                            </div>
                        )}
                    </div>
                </li>
            </ul>

            {showLoginPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <Login handleClose={handleClosePopup} onLoginSuccess={onLoginSuccess} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
