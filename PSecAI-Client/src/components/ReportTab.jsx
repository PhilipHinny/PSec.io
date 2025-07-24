import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ReportCard from './ReportCard';
import axios from "axios"; 
import '../styles/ReportTab.css';
import API_BASE_URL from '../apiConfig';


const ReportTab = ({ user }) => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);

    useEffect(() => {
        if (!user?.uid) return;

        const fetchReports = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/reports?user_id=${user.uid}`);
                setReports(response.data.reports || []);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, [user]);

    const handleTabClick = () => {
        navigate('/activitypage');
    };

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