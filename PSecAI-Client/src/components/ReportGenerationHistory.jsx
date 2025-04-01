import React from 'react'
import '../styles/ReportGenerationHistory.css'; 


const ReportGenerationHistory =()=> {
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
          <tr>
            <td>27 Feb, 2025, 10:30PM</td>
            <td>Q2 Performance Report</td>
            <td>
              <a href="#" className="view-link">
                View
              </a>
            </td>
            <td>
              <a href="#" className="download-link">
                Download
              </a>
            </td>
            <td>Generated</td>
          </tr>
          <tr>
            <td>27 Feb, 2025, 10:30PM</td>
            <td>Q2 Performance Report</td>
            <td>
              <a href="#" className="view-link">
                View
              </a>
            </td>
            <td>
              <a href="#" className="download-link">
                Download
              </a>
            </td>
            <td>Generated</td>
          </tr>
          <tr>
            <td>27 Feb, 2025, 10:30PM</td>
            <td>Q2 Performance Report</td>
            <td>
              <a href="#" className="view-link">
                View
              </a>
            </td>
            <td>
              <a href="#" className="download-link">
                Download
              </a>
            </td>
            <td>Generated</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default ReportGenerationHistory;