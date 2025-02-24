import React from 'react';
import ReportCard from './ReportCard';
import '../styles/ReportTab.css';

const ReportTab = () => {
    return (
        <div className='Report-container'>
            <p className='container-heading'>Reports</p>
            <div className="container-separater"></div>
            <ReportCard />
            <ReportCard />
            <ReportCard />
        </div>
    );
};

export default ReportTab;