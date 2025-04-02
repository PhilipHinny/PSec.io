import React, { useEffect, useState } from 'react';
import '../styles/RecentActivity.css';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/recent-activity")
      .then((response) => response.json())
      .then((data) => setActivities(data.recent_activity))
      .catch((error) => console.error("Error fetching recent activity:", error));
  }, []);

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
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <tr key={index}>
                  <td>{new Date(activity.date_time).toLocaleString()}</td>
                  <td>{activity.document_name}</td>
                  <td>{activity.action}</td>
                  <td>{activity.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No recent activities found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;
