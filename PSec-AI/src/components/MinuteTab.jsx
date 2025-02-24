import React from 'react';
import MintuesCard from '../components/MinuteCard'
import '../styles/ReportTab.css';

const ReportTab = () => {
    return (
        <div className='Report-container'>
            <p className='container-heading'> Minutes</p>
            <div className="container-separater"></div>
            <MintuesCard />
            <MintuesCard />
        </div>
    );
};

export default ReportTab;