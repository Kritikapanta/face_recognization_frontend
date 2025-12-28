import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import '../styles/administrator.css';

const Administrator = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [users, setUsers] = useState([]);
  const [timeFilter, setTimeFilter] = useState('day'); // 'day', 'month', 'year'

  useEffect(() => {
    // Fetch attendance data
    const attendanceRef = ref(database, 'attendance');
    const unsubscribeAttendance = onValue(attendanceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const attendanceList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setAttendanceData(attendanceList);
      } else {
        setAttendanceData([]);
      }
    });

    // Fetch users data
    const usersRef = ref(database, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
    });

    return () => {
      unsubscribeAttendance();
      unsubscribeUsers();
    };
  }, []);

  const handleAddUser = () => {
    navigate('/register');
  };

  const handleRemoveUser = () => {
    navigate('/remove-user');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getFilteredAttendance = () => {
    if (timeFilter === 'day') {
      const today = new Date().toDateString();
      return attendanceData.filter(record => 
        new Date(record.checkInTime).toDateString() === today
      );
    }
    // For month and year filters, you would implement more complex logic
    return attendanceData;
  };

  const filteredAttendance = getFilteredAttendance();

  return (
    <div className="admin-container">
      <h1 className="admin-title">Administrator Dashboard</h1>
      
      {/* Simple Action Buttons at Top */}
      <div className="admin-action-buttons">
        <button className="action-btn add-btn" onClick={handleAddUser}>
          <span className="btn-icon">+</span>
          <span className="btn-text">Add New User</span>
        </button>
        <button className="action-btn remove-btn" onClick={handleRemoveUser}>
          <span className="btn-icon">−</span>
          <span className="btn-text">Remove User</span>
        </button>
      </div>

      {/* Attendance Section */}
      <div className="attendance-section">
        <div className="section-header">
          <h2 className="section-title">Monthly Attendance</h2>
          <div className="filter-controls">
            <span className="filter-label">Sort by:</span>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${timeFilter === 'day' ? 'active' : ''}`}
                onClick={() => setTimeFilter('day')}
              >
                Day
              </button>
              <button 
                className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
                onClick={() => setTimeFilter('month')}
              >
                Month
              </button>
              <button 
                className={`filter-btn ${timeFilter === 'year' ? 'active' : ''}`}
                onClick={() => setTimeFilter('year')}
              >
                Year
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="table-container">
          {filteredAttendance.length > 0 ? (
            <div className="table-responsive">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Full Name</th>
                    <th>Job Role</th>
                    <th>Check In Time</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record) => {
                    const user = users.find(u => u.id === record.userId);
                    return (
                      <tr key={record.id}>
                        <td>{formatDate(record.checkInTime)}</td>
                        <td>{user?.fullName || 'Unknown User'}</td>
                        <td>{user?.jobRole || user?.userType === 'admin' ? 'Administrator' : 'Employee'}</td>
                        <td>{formatTime(record.checkInTime)}</td>
                        <td>
                          <span className={`attendance-status ${record.status || 'present'}`}>
                            {record.status || 'Present'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Attendance Records</h3>
              <p>Attendance data will appear when employees check in to the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Administrator;