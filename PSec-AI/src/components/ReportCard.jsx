import React from 'react';
import {FaFileAlt } from 'react-icons/fa';
import '../styles/ReportCard.css';

const ReportCard = () => {
    return (
        <div className="card">
            <FaFileAlt className="card-icon" />
            <div className="content">
                <h2 className="heading">Q3 Activity Report</h2>
                <p className="subheading">Generated on Feb 24, 2025</p>
            </div>
        </div>
    );
};

export default ReportCard;
