import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../styles/navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, userData, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const getRandomColor = () => {
    const colors = [
      '#024ce5', '#dc3545', '#28a745', '#ffc107', '#17a2b8',
      '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#6c757d'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getUserInitials = () => {
    if (userData?.fullName) {
      return userData.fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return currentUser?.email?.substring(0, 2).toUpperCase() || 'US';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="Logo" className="nav-logo" />
      </div>

      <div className="nav-right">
        <Link to="/" className="nav-link">Home</Link>
        
        {currentUser ? (
          <>
            {/* Show appropriate link based on user type */}
            {userData?.userType === 'admin' ? (
              <Link to="/administrator" className="nav-link">Dashboard</Link>
            ) : (
              <Link to="/attendance" className="nav-link">Attendance</Link>
            )}
            
            {/* User Profile with Dropdown */}
            <div className="user-profile-container" ref={dropdownRef}>
              <div className="user-profile" onClick={toggleDropdown}>
                <div 
                  className="profile-icon"
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {getUserInitials()}
                </div>
                <span className="user-name">
                  {userData?.fullName?.split(' ')[0] || currentUser?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div 
                      className="dropdown-icon"
                      style={{ backgroundColor: getRandomColor() }}
                    >
                      {getUserInitials()}
                    </div>
                    <div className="dropdown-user-info">
                      <div className="dropdown-name">{userData?.fullName || currentUser?.email}</div>
                      <div className="dropdown-role">
                        {userData?.userType === 'admin' ? 'Administrator' : 'Employee'}
                        {userData?.jobRole && ` • ${userData.jobRole}`}
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="dropdown-icon-logout">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="nav-link login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;