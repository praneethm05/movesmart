import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, User, Gift, MapPin } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const location = useLocation();
  const [time, setTime] = React.useState('');
  const [points, setPoints] = React.useState('1800');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
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
          <div className="location-display">
            <MapPin className="location-icon" size={20} />
            <div className="location-text">
              <small>You're in</small>
              <span>Mangaluru</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}; 