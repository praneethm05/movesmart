import React from "react";
import { Car, MapPin } from "lucide-react";
import "./Header.css";

const Header = () => {
  const [currentTime, setCurrentTime] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
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
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <Car size={24} className="brand-icon" />
          <div>
            <h1>Move Smart</h1>
            <span>the traffic dashboard solution</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="time-display">{currentTime}</div>
          <div className="drive-points">
            Drive Points <span>1800</span>
          </div>
          <div className="location-info">
            <MapPin size={20} />
            <div>
              <small>You're in</small>
              <span>Mangaluru</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
