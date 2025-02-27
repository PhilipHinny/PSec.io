import React from 'react';
import {FaFileAlt } from 'react-icons/fa';
import '../styles/ReportCard.css';

const ReportCard = () => {
    return (
        <div className="card">
            <FaFileAlt className="card-icon" />
            <div className="content">
                <h2 className="heading">Meeting with HR</h2>
                <p className="subheading">Time: Conference Room</p>
            </div>
        </div>
    );
};

export default ReportCard;
