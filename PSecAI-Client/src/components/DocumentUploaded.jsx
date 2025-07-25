import React, { useEffect, useState } from "react";
import '../styles/DocumentUploaded.css'; 
import API_BASE_URL from '../apiConfig';

function DocumentUploaded({user}) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
  if (!user?.uid) return; 

    // Fetch reports from backend API
  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Dashboardupload?user_id=${user.uid}`);
      const data = await response.json();
      setReports(data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };
    fetchReports();
  }, [user?.uid]);
  


  // Handle View Report
  const handleView = (filename) => {
    alert(`Opening report: ${filename}`);
    // You can replace this with an actual file URL if available
  };

  // Handle Delete Report
  const handleDelete = async (filename) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${filename}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/Deleteupload?filename=${encodeURIComponent(filename)}&user_id=${user.uid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReports(reports.filter((report) => report.title !== filename));
        alert("Report deleted successfully");
      } else {
        alert("Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <div className="table-section">
      <h2>Documents Uploaded</h2>
      <table className="document-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Document Name</th>
            <th>Preview</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <tr key={index}>
                <td>{report.date}</td>
                <td>{report.title}</td>
                <td>
                  <button className="view-link" onClick={() => handleView(report.title)}>View</button>
                </td>
                <td>
                  <button className="delete-link" onClick={() => handleDelete(report.title)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No reports found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentUploaded;
