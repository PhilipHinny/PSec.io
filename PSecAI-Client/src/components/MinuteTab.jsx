import {useState, useEffect} from 'react';
import ToDoCard from './TodoCard';
import axios from "axios"; 
import '../styles/ReportTab.css';
import API_BASE_URL from '../apiConfig';
import { Navigate } from 'react-router-dom';

const TodoTab = () => {

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
            <p className='container-heading'> To Do</p>
            <div className="container-separater"></div>
            <button 
            className='card-content'
            onClick={() => Navigate('/Todo')}
            >
                Add Task
            </button>
            {reports.length > 0 ? (
                reports.slice(0, 4).map((report, index) => (
                    <ToDoCard
                        key={index}
                        title={report.title}
                        date={report.date}
                    />
                ))
            ) : (
                <p>No Tasks found</p>
            )}
        </div>
    );
};

export default TodoTab;