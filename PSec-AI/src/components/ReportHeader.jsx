import React from 'react';
import '../styles/Report-header.css';
import { FaCog, FaUser } from 'react-icons/fa';
import FileUploadButton from './FileUploadButton';
import { useNavigate } from 'react-router-dom';

const ReportHeader = () => {
    const navigate = useNavigate();

    const handleLogoClick = () =>{
        navigate('/')
    }

    return (
       <div className="Reportheader-container">
            <div className='Report-logo' onClick={handleLogoClick}>PSec AI</div>
            <div className='uploadButton'><FileUploadButton /></div>
            <div className='options'>
                <div className="settings-option">
                <FaCog className='option-icon'/>
                </div>
                <div className="profile-option">
                <FaUser className='option-icon'/>
                </div>
            </div>
       </div>
    );
};

export default ReportHeader;
