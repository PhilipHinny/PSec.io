import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa';
import '../styles/ReportCard.css';

const ReportCard = ({ title, date }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate('/activitypage');
    };

    return (
        <div className="card" onClick={handleCardClick}>
            <FaFileAlt className="card-icon" />
            <div className="card-content">
                <h2 className="card-heading">{title}</h2>
                <p className="card-subheading">Generated on {date}</p>
            </div>
        </div>
    );
};

export default ReportCard;
