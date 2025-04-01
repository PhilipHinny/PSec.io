import React from 'react'
import '../styles/RecentActivity.css'; 


const RecentActivity =()=> {
  return (
    <div className="activity-section">
    <div className="table-section">
      <h2>Recent Activity</h2>
      <table className="document-table">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Document Name</th>
            <th>Action</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>27 Feb, 2025, 10:30PM</td>
            <td>Q2 Performance Report</td>
            <td>
                Generated
            </td>
            <td>Successfull</td>
          </tr>
          <tr>
            <td>27 Feb, 2025, 10:30PM</td>
            <td>Q2 Performance Report</td>
            <td>
                Generated
            </td>
            <td>Successfull</td>
          </tr><tr>
            <td>27 Feb, 2025, 10:30PM</td>
            <td>Q2 Performance Report</td>
            <td>
                Generated
            </td>
            <td>Failed</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default RecentActivity