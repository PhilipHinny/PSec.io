import React from 'react';
import '../styles/GenerateButton.css';

const GenerateButton = () => {
    return (
        <div className='generate-button'>
            <img src='/starsicon.png' alt='generate-icon' className='starsIcon' />
            <p>Generate New Content </p>
        </div>
    );
};

export default GenerateButton;