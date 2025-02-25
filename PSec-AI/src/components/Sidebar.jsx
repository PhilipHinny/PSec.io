import React from 'react';
import '../styles/Sidebar.css'; 
import ReportCard from '../components/ReportCard';
import { FaSearch } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
            <h2>My Reports</h2>
            <FaSearch className='search-icon'/>
            </div>
            <hr className='sidebar-separater'/>
            <div className='report-list'>
                <ReportCard />
                <ReportCard />
                <ReportCard />
                <ReportCard />
                <ReportCard />
            </div>
        </div>
    );
};

export default Sidebar;