import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from "react-icons/fa";
import '../styles/UploadPage.css';

const UploadPage = ({ user }) => {
    const [files, setFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        const filesWithDetails = acceptedFiles.map(file => ({
            name: file.name,
            extension: file.name.split('.').pop()
        }));
        setFiles(filesWithDetails);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleAnalyzeAndSave = async () => {
        if (files.length === 0) {
            alert("Please upload a file first!");
            return;
        }
    
        const formData = new FormData();
        // Append the file object directly, not the file details
        formData.append("file", files[0]);  // Make sure 'files[0]' is the actual file object
        formData.append("user_id", user?.uid); 
    
        try {
            const response = await fetch("http://127.0.0.1:5000/upload_report", {
                method: "POST",
                body: formData
            });
    
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload the file.");
        }
    };
    
    

    const handleClear = () => {
        setFiles([]);  // Clear the selected files
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
