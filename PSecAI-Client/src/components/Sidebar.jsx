import React, { useState, useEffect } from "react";
import "../styles/Sidebar.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios"; // Make sure axios is installed
import ReportCard from "../components/ReportCard"; // Import the updated ReportCard

const Sidebar = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        // Fetch reports from the backend
        const fetchReports = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/reports");
                setReports(response.data.reports || []);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h2>Recent Reports</h2>
                <FaSearch className="search-icon" />
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
