import React from 'react'
import '../styles/DocumentDashboard.css';

function DocumentUploaded() {
  return (
    <div className="table-section">
            <h2>Document Uploaded</h2>
            <table className="document-table">
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>Document Name</th>
                  <th>Preview</th>
                  <th>Action</th>
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
                    <a href="#" className="delete-link">
                      Delete
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  )
}

export default DocumentUploaded