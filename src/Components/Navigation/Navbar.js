import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, User, Gift, MapPin } from 'lucide-react';
import { trafficService } from '../../services/api';
import './Navbar.css';

export const Navbar = () => {
  const location = useLocation();
  const [time, setTime] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Loading...');
  const [locationError, setLocationError] = useState(null);
  const points = '1800';

  // Time update effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Location fetch effect
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // First try the API
        try {
          const response = await trafficService.getCurrentLocation();
          setCurrentLocation(response.data.city || 'Unknown Location');
          setLocationError(null);
          return;
        } catch (apiError) {
          console.log('API location fetch failed, trying browser geolocation');
        }

        // Fallback to browser geolocation
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Use reverse geocoding to get city name
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                {
                  headers: {
                    'User-Agent': 'MoveSmart Traffic Dashboard'
                  }
                }
              );
              const data = await response.json();
              const city = data.address?.city || 
                          data.address?.town || 
                          data.address?.municipality || 
                          'Unknown Location';
              setCurrentLocation(city);
              setLocationError(null);
            } catch (geocodeError) {
              console.error('Geocoding failed:', geocodeError);
              setCurrentLocation('Mangaluru'); // Fallback to default city
              setLocationError(null);
            }
          }, (error) => {
            console.error('Geolocation error:', error);
            setCurrentLocation('Mangaluru'); // Fallback to default city
            setLocationError(null);
          });
        } else {
          setCurrentLocation('Mangaluru'); // Fallback to default city
          setLocationError(null);
        }
      } catch (error) {
        console.error('Failed to fetch location:', error);
        setCurrentLocation('Mangaluru'); // Fallback to default city
        setLocationError(null);
      }
    };

    fetchLocation();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Car className="brand-icon" size={24} />
          <div className="brand-text">
            <h1>Move Smart</h1>
            <span>the traffic dashboard solution</span>
          </div>
        </Link>

        <div className="navbar-center">
          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
            <User size={20} />
            <span>Profile</span>
          </Link>
          <Link to="/vehicle" className={`nav-link ${location.pathname === '/vehicle' ? 'active' : ''}`}>
            <Car size={20} />
            <span>My Vehicle</span>
          </Link>
          <Link to="/redeem" className={`nav-link ${location.pathname === '/redeem' ? 'active' : ''}`}>
            <Gift size={20} />
            <span>Redeem</span>
          </Link>
        </div>

        <div className="navbar-end">
          <div className="time-display">{time}</div>
          <div className="points-display">
            Drive Points <span>{points}</span>
          </div>
          <div className={`location-display ${locationError ? 'error' : ''}`}>
            <MapPin className="location-icon" size={20} />
            <div className="location-text">
              <small>You're in</small>
              <span>{currentLocation}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}; 