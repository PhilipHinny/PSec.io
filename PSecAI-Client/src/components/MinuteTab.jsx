import {useState, useEffect} from 'react';
import MintuesCard from '../components/MinuteCard'
import axios from "axios"; 
import '../styles/ReportTab.css';
import API_BASE_URL from '../apiConfig';

const ReportTab = () => {

    const [reports, setReports] = useState([]);

    useEffect(() => {
        // Fetch reports from the backend
        const fetchReports = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/reports`);
                setReports(response.data.reports || []);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, []);


    return (
        <div className='Report-container'>
            <p className='container-heading'> Minutes</p>
            <div className="container-separater"></div>
            {reports.length > 0 ? (
                reports.slice(0, 4).map((report, index) => (
                    <MintuesCard 
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