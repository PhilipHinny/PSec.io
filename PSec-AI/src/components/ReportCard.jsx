import React from 'react';
import { useNavigate } from 'react-router-dom';
import {FaFileAlt } from 'react-icons/fa';
import '../styles/ReportCard.css';

const ReportCard = () => {
     const navigate = useNavigate();
    
    const handleCardClick = () => {
            navigate('/activitypage');
    };

    return (
        <div className="card" onClick={handleCardClick}>
            <FaFileAlt className="card-icon" />
            <div className="content">
                <h2 className="heading">Q3 Activity Report</h2>
                <p className="subheading">Generated on Feb 24, 2025</p>
            </div>
        </div>
    );
};

export default ReportCard;
