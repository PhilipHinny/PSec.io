import React, { useEffect, useState } from "react";
import "../styles/ReportGenerationHistory.css";
import API_BASE_URL from '../apiConfig';

const ReportGenerationHistory = ({ user, onLogout }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/generated_reports?user_id=${user.uid}`);
        const data = await response.json();
        console.log("Fetched reports:", data);
        setReports(data.generated_reports);
      } catch (error) {
        console.error("Error fetching generated reports:", error);
      }
    };

    fetchReports();
  }, [user]);

  const handleDownload = async (filename) => {
    const confirmDownload = window.confirm(`Are you sure you want to download ${filename}?`);
    if (!confirmDownload) return;

    try {
      const response = await fetch(`${API_BASE_URL}/download_report/${encodeURIComponent(filename)}`, {
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        alert("Download started!");
      } else {
        alert("Failed to download report");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <div className="activity-section">
      <div className="table-section">
        <h2>Report Generation History</h2>
        <table className="document-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Document Name</th>
              <th>Preview</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report._id}>
                  <td>{new Date(report.created_at).toLocaleString()}</td>
                  <td>{report.filename}</td>
                  <td>
                    <a href={`/view/${report.filename}`} className="view-link">
                      View
                    </a>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDownload(report.filename)}
                      className="delete-link"
                    >
                      Download
                    </button>
                  </td>
                  <td>Generated</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No reports found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportGenerationHistory;
