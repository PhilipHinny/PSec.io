import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from "react-icons/fa";
import '../styles/UploadPage.css';

const UploadPage = () => {
    const [files, setFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        const filesWithDetails = acceptedFiles.map(file => ({
            name: file.name,
            extension: file.name.split('.').pop()
        }));
        setFiles(filesWithDetails);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleAnalyzeAndSave = () => {
        console.log('Analyze & Save files:', files);
    };

    const handleClear = () => {
        setFiles([]);
    };

    return (
        <div className='Upload-Page'>
            <div className="upload-title">
                <h1>Upload Your Files</h1>
                <p>Upload your documents for processing</p>
            </div>

            <div className="Upload-Wrapper">
                    <div className='Upload-Container' {...getRootProps()}>
                        <input {...getInputProps()} />
                        {files.length > 0 ? (
                            <div className="file-info">
                                <span className="file-name">{files[0].name}</span>
                                <span className="file-extension">.{files[0].extension}</span>
                            </div>
                        ) : (
                            <div>
                                <FaCloudUploadAlt size={32} />
                                <p>Drag & drop some files here <br /> or click to select files</p>
                            </div>
                        )}
                </div>
            </div>

            <div className='buttons-section'>
                <button className="Upload-Buttons" onClick={handleAnalyzeAndSave}>Analyze & Save</button>
                <button className="Upload-Buttons" onClick={handleClear}>Clear</button>
            </div>
        </div>
    );
};

export default UploadPage;
