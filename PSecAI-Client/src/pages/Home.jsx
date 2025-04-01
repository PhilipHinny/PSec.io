import React, { useEffect } from 'react';
import '../styles/Home.css';
import ReportTab from '../components/ReportTab';
import MinuteTab from '../components/MinuteTab';
import InsightTab from '../components/InsightTab';
import GenerateButton from '../components/GenerateButton';

const Home = ({ user }) => {

    // Function to display a greeting based on the time of day
    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return 'Good Morning';
        } else if (currentHour < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    };

    // Get the user's profile name or fall back to their email if not available
    const getUserName = () => {
        if (user) {
            return user.displayName || user.email.split('@')[0];  
        }
        return 'Guest'; 
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <div className="hero-section">
                <h1 className='hero-heading'>{getGreeting()}, {getUserName()}</h1>  
                <p className='hero-subtext'>How can I assist you today?</p>
            </div>

            <div className="card-container">
                <MinuteTab />
                <ReportTab />
                <InsightTab />
            </div>

            <div className="button-section">
                <GenerateButton />
            </div>
        </div>
    );
};

export default Home;
