import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ReportCard from './ReportCard';
import axios from "axios"; 
import '../styles/ReportTab.css';


const ReportTab = () => {
    const navigate = useNavigate();

    const handleTabClick = () => {
        navigate('/activitypage');
    };

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
        <div className='Report-container'>
            <p className='container-heading' onClick={handleTabClick}>Reports</p>
            <div className="container-separater"></div>
            {reports.length > 0 ? (
                reports.slice(0, 4).map((report, index) => (
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
    );
};

export default ReportTab;