import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ReportCard from "../components/ReportCard"; 
import "../styles/Sidebar.css";
import axios from "axios"; 

const Sidebar = ({user}) => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        if (!user?.uid) return; 

        // Fetch reports from the backend
        const fetchReports = async () => {
            try {
                const response = await axios.get(`http://100.80.125.69:5000/reports?user_id=${user.uid}`);
                setReports(response.data.reports || []);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, [user]);

    return (
        <div className="chat-sidebar-container">
            <div className="chat-sidebar-header">
                <h2>Recent Reports</h2>
                <FaSearch className="sidebar-search-icon" />
            </div>

            <div className="report-list">
                {reports.length > 0 ? (
                    reports.map((report, index) => (
                        <ReportCard 
                            key={index} 
                            title={report.title} 
                            date={report.date} 
                        />
                    ))
                ) : (
                    <p>No reports found</p>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
