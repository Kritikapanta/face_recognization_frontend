import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/attendance.css';
import faceId from '../assets/face-id.png'; // Face ID image

const Attendance = () => {
  const { currentUser, userData } = useAuth();

  // Camera & attendance states
  const [message, setMessage] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  // Open camera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      setMessage("📷 Camera opened. Ready to mark attendance.");
    } catch (err) {
      alert("Cannot access camera: " + err.message);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // Mark attendance (simulation)
  const markAttendance = () => {
    if (!cameraActive) {
      alert("Please open the camera first!");
      return;
    }

    setMessage("📷 Scanning face...");

    setTimeout(() => {
      setMessage("✅ Attendance marked successfully");
      stopCamera();
    }, 2000);
  };

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Attendance Dashboard</h1>
      
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Welcome, {userData?.fullName || currentUser?.email || 'User'}!</h2>
        <p className="user-role">
          Role: {userData?.userType === 'admin' ? 'Administrator' : 'Employee'}
          {userData?.jobRole && ` (${userData.jobRole})`}
        </p>
      </div>

      {/* Face Recognition Attendance (Placed right after welcome) */}
      <div className="attendance-box">
        <h3>Face Recognition Attendance</h3>
        <img src={faceId} alt="Face ID" className="face-id-image" />

        {!cameraActive && (
          <button className="camera-btn" onClick={openCamera}>
            Open Camera
          </button>
        )}

        {cameraActive && (
          <div className="camera-container">
            <video ref={videoRef} autoPlay playsInline width="300" />
            <div className="camera-buttons">
              <button className="camera-btn" onClick={markAttendance}>
                Mark Attendance
              </button>
              <button className="camera-btn" onClick={stopCamera}>
                Close Camera
              </button>
            </div>
          </div>
        )}

        <p>{message}</p>
      </div>

      {/* Attendance Info / Stats */}
      <div className="attendance-info">
        <h3>Employee Attendance Portal</h3>
        <p>This page is for employee attendance tracking.</p>
        
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
