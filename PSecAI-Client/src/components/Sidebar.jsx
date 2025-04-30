import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ReportCard from "../components/ReportCard"; 
import "../styles/Sidebar.css";
import axios from "axios"; 

const Sidebar = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        // Fetch reports from the backend
        const fetchReports = async () => {
            try {
                const response = await axios.get("http://192.168.0.105:5000/reports");
                setReports(response.data.reports || []);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, []);

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
