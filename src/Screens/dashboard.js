import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronRight, Plus, AlertCircle, Clock, Fuel, Award, TrendingDown, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { TrafficInsights } from '../Components/TrafficInsights';
import { trafficService, routeService } from '../services/api';
import "./dashboard.css";

const RouteItem = ({ route_id, name, onDelete }) => {
  const [routeInfo, setRouteInfo] = useState({
    duration: '25 mins',
    distance: '5.2 km',
    expectedDeparture: '04:41 AM',
    event: {
      name: 'City Music Festival',
      type: 'Entertainment',
      location: 'City Centre Amphitheatre'
    }
  });

  return (
    <div className="route-wrapper">
      <div className="route-header-section">
        <div className="route-title">
          <span className="route-name">{routeInfo.event.name}</span>
          <span className="traffic-badge">Medium</span>
          <span className="duration-tag">{routeInfo.duration}</span>
        </div>
        <div className="route-metrics">
          <div className="metric-row">
            <span>Normal Duration:</span>
            <span className="metric-value">{routeInfo.duration}</span>
          </div>
          <div className="metric-row">
            <span>Distance:</span>
            <span className="metric-value">{routeInfo.distance}</span>
          </div>
          <div className="metric-row">
            <span>Location:</span>
            <span className="metric-value">{routeInfo.event.location}</span>
          </div>
          <div className="metric-row departure">
            <span>Expected Departure:</span>
            <span className="departure-time">{routeInfo.expectedDeparture}</span>
          </div>
        </div>
        <div className="route-actions">
          <button className="delete-btn" onClick={() => onDelete(route_id)}>
            <Trash2 size={18} />
          </button>
          <button className="go-btn">
            Go <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AddRouteModal = ({ isOpen, onClose, onAdd }) => {
  const [newRoute, setNewRoute] = useState({
    title: '',
    start_location: '',
    end_location: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const routeData = {
        route_id: `ROUTE${Date.now()}`,
        user_id: "1", // Replace with actual user ID from auth
        title: newRoute.title,
        start_location: newRoute.start_location,
        end_location: newRoute.end_location,
        lastUpdated: new Date().toISOString()
      };

      await routeService.addRoute(routeData);
      onAdd(); // Refresh routes list
      onClose();
      setNewRoute({ title: '', start_location: '', end_location: '' }); // Reset form
    } catch (error) {
      console.error('Failed to add route:', error);
      alert('Failed to add route. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-route-modal">
        <h3>Add New Route</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Route Title*</label>
            <input
              type="text"
              placeholder="Home to Work, Shopping Route, etc."
              value={newRoute.title}
              onChange={(e) => setNewRoute({...newRoute, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Location*</label>
            <input
              type="text"
              placeholder="Enter start location"
              value={newRoute.start_location}
              onChange={(e) => setNewRoute({...newRoute, start_location: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>End Location*</label>
            <input
              type="text"
              placeholder="Enter destination"
              value={newRoute.end_location}
              onChange={(e) => setNewRoute({...newRoute, end_location: e.target.value})}
              required
            />
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

const DUMMY_ROUTES = [
  {
    route_id: 'ROUTE1',
    name: "City Music Festival",
    coordinates: {
      origin: "28.6139,77.2090",
      destination: "28.5529,77.2366"
    },
    time: "9:00 AM",
    duration: "25 mins",
    distance: "5.2 km",
    trafficStatus: "medium",
    event: {
      name: "City Music Festival",
      type: "Entertainment",
      location: "City Centre Amphitheatre"
    }
  },
  {
    route_id: 'ROUTE2',
    name: "Food & Wine Expo",
    coordinates: {
      origin: "28.6129,77.2290",
      destination: "28.5729,77.2166"
    },
    time: "2:30 PM",
    duration: "15 mins",
    distance: "3.8 km",
    trafficStatus: "low",
    event: {
      name: "Food & Wine Expo",
      type: "Food & Beverage",
      location: "Convention Center"
    }
  },
  {
    route_id: 'ROUTE3',
    name: "Tech Conference",
    coordinates: {
      origin: "28.6339,77.2190",
      destination: "28.5829,77.2266"
    },
    time: "6:00 PM",
    duration: "35 mins",
    distance: "7.5 km",
    trafficStatus: "high",
    event: {
      name: "Tech Conference",
      type: "Business",
      location: "Innovation Hub"
    }
  }
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [trafficStatus, setTrafficStatus] = useState({
    density: 'Loading...',
    nextBestTime: null,
    lastUpdated: null,
    hoursSinceChange: 0
  });

  const getTrafficColor = (density) => {
    switch(density?.toLowerCase()) {
      case 'low':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'high':
        return 'red';
      default:
        return 'gray';
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await routeService.getAllRoutes();
      if (response.data && response.data.length > 0) {
        const routesData = response.data.map(route => ({
          route_id: route.route_id,
          name: route.title,
          coordinates: {
            origin: route.start_location,
            destination: route.end_location
          },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: "Calculating...",
          trafficStatus: "medium"
        }));
        setRoutes(routesData);
      } else {
        setRoutes(DUMMY_ROUTES);
      }
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      setRoutes(DUMMY_ROUTES);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Fetch traffic info for routes
  useEffect(() => {
    const fetchTrafficInfo = async () => {
      try {
        const updatedRoutes = await Promise.all(
          routes.map(async (route) => {
            if (route.coordinates) {
              try {
                const trafficInfo = await trafficService.getTrafficInfo(
                  route.coordinates.origin,
                  route.coordinates.destination
                );
                return { 
                  ...route, 
                  trafficInfo,
                  trafficStatus: trafficInfo.trafficDensity.toLowerCase()
                };
              } catch (error) {
                console.error(`Failed to fetch traffic for route ${route.name}:`, error);
                return route;
              }
            }
            return route;
          })
        );
        setRoutes(updatedRoutes);
      } catch (error) {
        console.error('Failed to update routes with traffic info:', error);
      }
    };

    fetchTrafficInfo();
    const interval = setInterval(fetchTrafficInfo, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Traffic status effect
  useEffect(() => {
    const fetchTrafficStatus = async () => {
      try {
        const coordinates = {
          origin: "28.6139,77.2090",
          destination: "28.5529,77.2366"
        };
        
        console.log('Fetching traffic status for coordinates:', coordinates);
        
        const response = await trafficService.getLocationTraffic(coordinates);
        console.log('Traffic API Response:', response);

        // Set default values if response is empty
        if (!response || !response.trafficDensity) {
          console.error('Invalid response format:', response);
          setTrafficStatus({
            density: 'Low', // Default to Low if no data
            nextBestTime: '2:45 PM',
            lastUpdated: new Date().toISOString(),
            hoursSinceChange: 2 // Default to 2 hours
          });
          return;
        }
        
        // Get the previous status from DB
        const previousStatus = await trafficService.getPreviousTrafficStatus();
        console.log('Previous traffic status:', previousStatus);
        
        let hoursSinceChange = 2; // Default to 2 hours if no previous data
        if (previousStatus && previousStatus.density !== response.trafficDensity) {
          const lastUpdate = new Date(previousStatus.timestamp);
          const now = new Date();
          hoursSinceChange = Math.round((now - lastUpdate) / (1000 * 60 * 60));
        }

        setTrafficStatus({
          density: response.trafficDensity,
          nextBestTime: response.nextBestTime || '2:45 PM',
          lastUpdated: new Date().toISOString(),
          hoursSinceChange
        });

      } catch (error) {
        console.error('Failed to fetch traffic status:', error);
        // Set default values on error
        setTrafficStatus({
          density: 'Low', // Default to Low if API fails
          nextBestTime: '2:45 PM',
          lastUpdated: new Date().toISOString(),
          hoursSinceChange: 2
        });
      }
    };

    fetchTrafficStatus();
    const interval = setInterval(fetchTrafficStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteRoute = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await routeService.deleteRoute(routeId);
        // Refresh routes list
        await fetchRoutes();
        alert('Route deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete route. Please try again.');
      }
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="left-section">
          <div className="traffic-status-card">
            <div className={`traffic-indicator ${trafficStatus.density?.toLowerCase()}`} />
            <div className="status-content">
              <h3>Your location is Currently</h3>
              <p className="status-highlight">
                Experiencing {trafficStatus.density === 'Low' ? 'Light' : trafficStatus.density} Traffic
                {trafficStatus.hoursSinceChange > 0 && ` for the past ${trafficStatus.hoursSinceChange} hours`}
              </p>
              <div className="time-prediction">
                <p>Convenient time to drive smoothly</p>
                <p className="expected-time">
                  Expected: {trafficStatus.nextBestTime || '2:45 PM'}
                </p>
              </div>
            </div>
          </div>

          <TrafficInsights />
          <div className="route-plans-card">
            <div className="card-header">
              <div className="header-left">
                <h3>Active Route Plans</h3>
                <span className="traffic-level">
                  {routes.some(r => r.trafficStatus === "high") ? "High" : "Med"}
                </span>
              </div>
              <button className="add-route-btn" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} />
                Add Route
              </button>
            </div>
            <div className="routes-list">
              {routes.map((route) => (
                <RouteItem 
                  key={route.route_id}
                  route_id={route.route_id}
                  name={route.name}
                  onDelete={handleDeleteRoute}
                />
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
          onAdd={fetchRoutes}
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

