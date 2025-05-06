import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from "react-icons/fa";
import '../styles/UploadPage.css';

const UploadPage = ({ user }) => {
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    // Store the actual file object in the state
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleAnalyzeAndSave = async () => {
    if (files.length === 0) {
      alert("Please upload a file first!");
      return;
    }

    // Ensure user is authenticated and get the Firebase user ID
    const userId = user?.uid;
    if (!userId) {
      alert("User is not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]); // Append the actual file object, not just metadata
    formData.append("user_id", userId); // Pass the Firebase user ID

    try {
      const response = await fetch("http://192.168.0.115:5000/upload_report", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        // Navigate to /ActivityPage after successful upload
        window.location.href = "/ActivityPage";
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
              <span className="file-extension">.{files[0].name.split('.').pop()}</span>
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
