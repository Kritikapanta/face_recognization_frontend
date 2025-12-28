import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/attendance.css';

const Attendance = () => {
  const { currentUser, userData } = useAuth();

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Attendance Dashboard</h1>
      
      <div className="welcome-section">
        <h2>Welcome, {userData?.fullName || currentUser?.email || 'User'}!</h2>
        <p className="user-role">
          Role: {userData?.userType === 'admin' ? 'Administrator' : 'Employee'}
          {userData?.jobRole && ` (${userData.jobRole})`}
        </p>
      </div>
      
      <div className="attendance-info">
        <h3>Employee Attendance Portal</h3>
        <p>This page is for employee attendance tracking. Features will be added soon.</p>
        
        <div className="attendance-status">
          <div className="status-card">
            <div className="status-icon">📅</div>
            <h4>Today's Status</h4>
            <p className="status-text">Not Checked In</p>
          </div>
          
          <div className="status-card">
            <div className="status-icon">⏰</div>
            <h4>Office Hours</h4>
            <p className="status-text">9:00 AM - 5:00 PM</p>
          </div>
          
          <div className="status-card">
            <div className="status-icon">📊</div>
            <h4>This Month</h4>
            <p className="status-text">0 Days Present</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;