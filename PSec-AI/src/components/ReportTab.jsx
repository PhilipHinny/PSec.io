import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportCard from './ReportCard';
import '../styles/ReportTab.css';

const ReportTab = () => {
    const navigate = useNavigate();

    const handleTabClick = () => {
        navigate('/activitypage');
    };

    return (
        <div className='Report-container'>
            <p className='container-heading' onClick={handleTabClick}>Reports</p>
            <div className="container-separater"></div>
            <ReportCard />
            <ReportCard />
            <ReportCard />
        </div>
    );
};

export default ReportTab;