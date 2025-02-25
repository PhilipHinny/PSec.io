import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import Header from '../components/Header';
import ReportTab from '../components/ReportTab';
import MinuteTab from '../components/MinuteTab';
import InsightTab from '../components/InsightTab';
import GenerateButton from '../components/GenerateButton';

const Home = () => {
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

    return (
        <div>
            <Header />

            <div className="hero-section">
                <h1 className='hero-heading'>{getGreeting()}, Philip</h1>
                <p className='hero-subtext'>How can I assist you today?</p>
            </div>

            <div className="card-container">
                <MinuteTab />
                <Link to="/chat" style={{ textDecoration: 'none' }}>
                    <ReportTab />
                </Link>
                <InsightTab />
            </div>

            <div className="button-section">
                <GenerateButton />
            </div>
        </div>
    );
};

export default Home;
