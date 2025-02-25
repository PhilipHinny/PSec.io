import React from 'react';
import '../styles/Header.css';
import { FaCog, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogoClick = () =>{
        navigate('/');
    }
    const getCurrentDateTime = () => {
        const now = new Date();
        const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
        const day = now.getDate();
        const year = now.getFullYear();
        const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });

        return `
            ${weekday} ${day}, ${year}
            <div class='separater'></div>
            ${time}</div>
        `;
    };

    return (
       <div className="header-container">
        <ul>
            <li className='logo' onClick={handleLogoClick}>PSec AI</li>
            <li className='Date-time-container' dangerouslySetInnerHTML={{ __html: getCurrentDateTime() }}></li>
            <li className='options'>
                <div className="settings-option">
                <FaCog className='option-icon'/>
                </div>
                <div className="profile-option">
                <FaUser className='option-icon'/>
                </div>
            </li>
        </ul>
       </div>
    );
};

export default Header;
