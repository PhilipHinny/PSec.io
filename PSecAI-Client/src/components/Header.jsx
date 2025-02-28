import React, { useState } from 'react';
import '../styles/Header.css';
import { FaCog, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

const Header = ({ user, onLoginSuccess, onLogout }) => {
    const navigate = useNavigate();
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

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
        setShowLoginPopup(true);  // Show login popup
    };

    const handleClosePopup = () => {
        setShowLoginPopup(false);  // Close login popup
    };

    const toggleDropdown = () => {
        setShowDropdown(prevState => !prevState);  // Toggle the dropdown visibility
    };

    // Fallback image for the profile
    const defaultProfileImage = "https://www.example.com/default-profile-image.jpg";  // Replace with your default image URL

    return (
        <div className="header-container">
            <ul>
                <li className='logo' onClick={handleLogoClick}>PSec AI</li>
                <li className='Date-time-container'>{getCurrentDateTime()}</li>
                <li className='options'>
                    <div className="settings-option">
                        <FaCog className='option-icon'/>
                    </div>
                    <div className="profile-option" onClick={user ? toggleDropdown : handleLoginClick}>
                        {user ? (
                            // If user is logged in, show their profile picture
                            <img 
                                src={user.photoURL || defaultProfileImage} 
                                alt="Profile" 
                                className="profile-img" 
                            />
                        ) : (
                            // If not logged in, show default FaUser icon
                            <FaUser className='option-icon'/>
                        )}
                    </div>

                    {/* Dropdown Menu */}
                    {showDropdown && user && (
                        <div className="dropdown-menu">
                            <button onClick={onLogout}>Logout</button>
                            <button onClick={() => navigate('/Policypage')}>Policy</button>
                        </div>
                    )}
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
