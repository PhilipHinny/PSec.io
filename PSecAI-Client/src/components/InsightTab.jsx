import React from 'react';
import '../styles/InsightTab.css';

const ReportTab = () => {
    const percentage = 20;

    const tasks = 8;
    const totaltask = 10;
    

    return (
        <div className='Insight-container'>
            <p className='container-heading'> Insights</p>
            <div className="container-separater"></div>
            <div className='percentage-indicator'>
            <p className='percentage-container'>
                {percentage}
                <div className='symbol'>%</div>
            </p>
                <p className='subtext'>More productive than usual</p>
                <div className='percentage-bar'></div>
            </div>

            <div className='percentage-indicator'>
            <p className='percentage-container'>
                {tasks}
                <div className='symbol'>/{totaltask}</div>
            </p>
                <p className='subtext'>Tasks completed this week</p>
                <div className='task-bar'></div>
            </div>
        </div>
    );
};

export default ReportTab;