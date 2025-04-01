import React from 'react';
import '../styles/DocumentDashboard.css'; // Import your CSS file for styling

function DocumentDashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="MyDocument-sidebar">
        <div className="MyDocument-logo">
          <div className="MyDocument-logo-icon">
          <img src="/PsecIcon.png" alt="Logo" className="logo-image" />
          </div>
          <h2>PSec Ai</h2>
        </div>

        <nav className="MyDocument-nav-menu">
          <ul>
            <li>
              <a href="#" className="MyDocument-nav-item">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="MyDocument-nav-item">
                My Documents
              </a>
            </li>
            <li>
              <a href="#" className="MyDocument-nav-item">
                Account Settings
              </a>
            </li>
            <li>
              <a href="#" className="MyDocument-nav-item">
                Billing & Plan
              </a>
            </li>
            <li>
              <a href="#" className="MyDocument-nav-item">
                Help/Support
              </a>
            </li>
          </ul>
        </nav>

        <div className="logout">
          <a href="#" className="logout-btn">
            Log out
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <button className="upload-btn">
            <span className="plus-icon">+</span> Upload
          </button>
          <div className="user-profile">
            <div className="profile-icon"></div>
          </div>
        </div>

        <div className="content">
          <h1>My Documents</h1>

          <div className="filters">
            <div className="search-container">
              <i className="search-icon"></i>
              <input type="text" placeholder="Search document" className="search-input" />
            </div>

            <div className="dropdown-filters">
              <div className="filter-dropdown">
                <span>Last 7 days</span>
                <i className="dropdown-icon"></i>
              </div>

              <div className="filter-dropdown">
                <span>Downloaded</span>
                <i className="dropdown-icon"></i>
              </div>
            </div>
          </div>

          {/* Document Uploaded Table */}
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

          {/* Report Generation History Table */}
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
      </div>
    </div>
  )
}

export default DocumentDashboard

