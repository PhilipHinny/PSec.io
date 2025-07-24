import React, { useEffect, useState } from 'react';
import '../styles/RecentActivity.css';
import API_BASE_URL from '../apiConfig';

const RecentActivity = ({ user, onLogout }) => {
  const [activities, setActivities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  
  useEffect(() => {
    if (!user?.uid) return;
  
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/recent-activity?user_id=${user.uid}`);
        const data = await response.json();
        if (data.recent_activity) {
          setActivities(data.recent_activity);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };
  
    fetchActivities();
  }, [user]);

  

  const displayedActivities = showAll ? activities : activities.slice(0, 4);

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
            {displayedActivities.length > 0 ? (
              displayedActivities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.date_time}</td>
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
        {activities.length > 4 && !showAll && (
          <button className="show-more-btn" onClick={() => setShowAll(true)}>Show More</button>
        )}
        {showAll && activities.length > 4 && (
          <button className="show-less-btn" onClick={() => setShowAll(false)}>Show Less</button>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
