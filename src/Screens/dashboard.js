import React, { useState } from "react";
import { Search, MapPin, ChevronRight, Plus, AlertCircle, Clock, Fuel, Award, TrendingDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { TrafficInsights } from '../Components/TrafficInsights';
import "./dashboard.css";

const RouteItem = ({ name, time, duration, recommendedTime, trafficStatus }) => (
  <div className="route-item">
    <div className="route-info">
      <div className="route-main">
        <h4>{name}</h4>
        <p>{time} • {duration}</p>
      </div>
      <div className="route-recommendation">
        <span>Recommended Time: {recommendedTime}</span>
        <div className={`route-traffic-indicator ${trafficStatus}`} />
      </div>
    </div>
    <button className="go-btn">
      Go <ChevronRight size={16} />
    </button>
  </div>
);

const AddRouteModal = ({ isOpen, onClose }) => {
  const [newRoute, setNewRoute] = useState({
    name: '',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-route-modal">
        <h3>Add New Route</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Route Name</label>
            <input
              type="text"
              placeholder="Home, Work, etc."
              value={newRoute.name}
              onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <div className="location-field">
              <input
                type="text"
                placeholder="Enter location"
                value={newRoute.location}
                onChange={(e) => setNewRoute({...newRoute, location: e.target.value})}
                required
              />
              <button type="button" className="location-icon-btn">
                <MapPin size={18} />
              </button>
            </div>
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

const ReportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="report-modal">
        <h3>Report Traffic Issue</h3>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [routes] = useState([
    { 
      name: "Bunagere, Endgame", 
      time: "2:32 PM", 
      duration: "7 Min Drive",
      recommendedTime: "2:15 PM",
      trafficStatus: "heavy"
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
    }
  ]);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="left-section">
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

          <TrafficInsights />

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
              <button 
                className="search-btn"
                onClick={() => navigate('/navigate')}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="insights-stats-container">
        <div className="insights-stats">
          <div className="stat-card">
            <Clock className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">50</div>
              <div className="stat-label">Hours of Traffic Less Drive</div>
            </div>
          </div>
          <div className="stat-card">
            <Fuel className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">5,000</div>
              <div className="stat-label">Points Redeemed for Fuel</div>
            </div>
          </div>
          <div className="stat-card">
            <Award className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">15</div>
              <div className="stat-label">Achievements Unlocked This Month</div>
            </div>
          </div>
          <div className="stat-card">
            <TrendingDown className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">30%</div>
              <div className="stat-label">Reduction in Travel Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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

