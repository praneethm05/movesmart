import React, { useState } from "react";
import { Search, MapPin, ChevronRight, Plus, AlertCircle } from "lucide-react";
import "./dashboard.css";

// Define routes data
const routesData = [
  { 
    name: "Bunagere, Endgame", 
    time: "2:32 PM", 
    duration: "7 Min Drive",
    recommendedTime: "2:15 PM",
    trafficStatus: "heavy" // can be 'light', 'medium', 'heavy'
  },
  { 
    name: "Home", 
    time: "2:45 PM", 
    duration: "7 Min Drive",
    recommendedTime: "2:30 PM",
    trafficStatus: "medium"
  },
  { 
    name: "Work", 
    time: "7:32 PM", 
    duration: "7 Min Drive",
    recommendedTime: "7:15 PM",
    trafficStatus: "light"
  },
];

// RouteItem Component
const RouteItem = ({ name, time, duration, recommendedTime, trafficStatus }) => (
  <div className="route-item">
    <div className="route-info">
      <div className="route-main">
        <h4>{name}</h4>
        <p>{time} • {duration}</p>
      </div>
      <div className="route-recommendation">
        <div className={`traffic-indicator ${trafficStatus}`}></div>
        <p>Recommended departure: <span>{recommendedTime}</span></p>
      </div>
    </div>
    <button className="go-btn">
      Go <ChevronRight size={16} />
    </button>
  </div>
);

// InsightItem Component
const InsightItem = ({ text, percentage, isUserReported }) => (
  <div className="insight-item">
    <div className="insight-header">
      <span>{text}</span>
      <span className="percentage">{percentage}%</span>
    </div>
    {isUserReported && <p className="user-reported">user's reported</p>}
  </div>
);

// Define ReportModal before Dashboard component
const ReportModal = ({ isOpen, onClose }) => {
  const [reportData, setReportData] = useState({
    description: '',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Report submitted:', reportData);
    setReportData({ description: '', location: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-route-modal report-modal">
        <h3>Report Traffic Issue</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe the traffic issue..."
              value={reportData.description}
              onChange={(e) => setReportData({...reportData, description: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <div className="location-field">
              <input
                type="text"
                placeholder="Enter location"
                value={reportData.location}
                onChange={(e) => setReportData({...reportData, location: e.target.value})}
                required
              />
              <button type="button" className="location-icon-btn">
                <MapPin size={18} />
              </button>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add this after ReportModal component (around line 113)
const AddRouteModal = ({ isOpen, onClose }) => {
  const [routeData, setRouteData] = useState({
    destination: '',
    arrivalTime: '',
    priority: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Route submitted:', routeData);
    setRouteData({ destination: '', arrivalTime: '', priority: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-route-modal">
        <h3>Add New Route</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              placeholder="Enter destination"
              value={routeData.destination}
              onChange={(e) => setRouteData({...routeData, destination: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Arrival Time</label>
            <input
              type="time"
              value={routeData.arrivalTime}
              onChange={(e) => setRouteData({...routeData, arrivalTime: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select 
              className="priority-select"
              value={routeData.priority}
              onChange={(e) => setRouteData({...routeData, priority: e.target.value})}
              required
            >
              <option value="">Select priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add Route</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Then define Dashboard component
export const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [routes, setRoutes] = useState(routesData);
  const [newRoute, setNewRoute] = useState({
    destination: '',
    arrivalTime: '',
    priority: ''
  });

  const calculateRecommendedTime = (arrivalTime) => {
    if (!arrivalTime) return '';
    const [hours, minutes] = arrivalTime.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes) - 15);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Left Section */}
        <div className="left-section">
          {/* Traffic Status */}
          <div className="traffic-status-card">
            <div className="traffic-indicator">
              {/* Pulsing red circle */}
            </div>
            <div className="status-content">
              <h3>Your location is Currently</h3>
              <p className="status-highlight">Experiencing Traffic for the past 2 hours</p>
              <div className="time-prediction">
                <p>Convenient time to drive smoothly</p>
                <p className="expected-time">Expected: 2:45 PM</p>
              </div>
            </div>
          </div>

          {/* Route Plans */}
          <div className="route-plans-card">
            <div className="card-header">
              <div className="header-left">
                <h3>Active Route Plans</h3>
                <span className="traffic-level">Med</span>
              </div>
              <button className="add-route-btn" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} />
                Add Route
              </button>
            </div>
            <div className="routes-list">
              {routes.map((route, index) => (
                <RouteItem key={index} {...route} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="search-card">
            <h3>Move Where?</h3>
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="City Centre, Mall"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button className="search-btn">Go</button>
            </div>
          </div>

          <div className="insights-card">
            <div className="insights-header">
              <h3>Insights on Traffic in your region</h3>
              <button className="report-issue-btn" onClick={() => setIsReportModalOpen(true)}>
                <AlertCircle size={16} />
                Report Issue
              </button>
            </div>
            
            <div className="insight-item">
              <div className="insight-header">
                <span>Reported Road Works near @hampankatta</span>
                <span className="percentage">85%</span>
              </div>
              <p className="user-reported">user's reported</p>
            </div>

            <div className="insight-item">
              <div className="insight-header">
                <span>For the past 24 days</span>
                <span className="percentage">100%</span>
              </div>
              <p className="user-reported">user's reported</p>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AddRouteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
};

