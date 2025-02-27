import React from 'react';
import '../styles/GenerateButton.css';
import { useNavigate } from 'react-router-dom';

const GenerateButton = () => {
    const navigate = useNavigate();

    const handleClick = () =>{
        navigate('/ActivityPage');
    }
    return (
        <div className='generate-button' onClick={handleClick}>
            <img src='/starsicon.png' alt='generate-icon' className='starsIcon' />
            <p>Generate New Content </p>
        </div>
    );
};

export default GenerateButton;