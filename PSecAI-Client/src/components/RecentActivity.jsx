import React, { useEffect, useState } from 'react';
import '../styles/RecentActivity.css';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("http://192.168.0.105:5000/recent-activity")
      .then((response) => response.json())
      .then((data) => setActivities(data.recent_activity))
      .catch((error) => console.error("Error fetching recent activity:", error));
  }, []);

  const displayedActivities = showAll ? activities : activities.slice(0, 4);

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

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
        {activities.length > 4 && !showAll && (
          <button className="show-more-btn" onClick={handleShowMore}>Show More</button>
        )}
        {showAll && activities.length > 4 && (
          <button className="show-less-btn" onClick={handleShowLess}>Show Less</button>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
