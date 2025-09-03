import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import ReportTab from '../components/ReportTab';
import TodoTab from '../components/MinuteTab';
import InsightTab from '../components/InsightTab';
import GenerateButton from '../components/GenerateButton';


const Home = ({ user }) => {
    const [userName, setUserName] = useState('Guest');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Update userName when user changes
    useEffect(() => {
        if (user) {
            if (user.displayName) setUserName(user.displayName);
            else if (user.email) setUserName(user.email.split('@')[0]);
            else setUserName('Guest');
        } else {
            setUserName('Guest');
        }
    }, [user]);

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) return 'Good Morning';
        else if (currentHour < 18) return 'Good Afternoon';
        else return 'Good Evening';
    };

    return (
        <div>
            <div className="hero-section">
                <h1 className='hero-heading'>{getGreeting()}, {userName}</h1>
                <p className='hero-subtext'>How can I assist you today?</p>
            </div>

            <div className="card-container">
                <TodoTab />
                <ReportTab user={user} />
                <InsightTab />
            </div>

            <div className="button-section">
                <GenerateButton />
            </div>
        </div>
    );
};

export default Home;
