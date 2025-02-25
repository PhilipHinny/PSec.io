import React from 'react';
import '../styles/FileUploadButton.css';
import { FaPlus } from 'react-icons/fa';

const FileUploadButton = () => {
    return (
        <div className='upload-button'>
            <FaPlus className='upload-icon'/>
            <p>Upload File</p>
        </div>
    );
};

export default FileUploadButton;