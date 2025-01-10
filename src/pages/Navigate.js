import React, { useState } from 'react';
import './Navigate.css';

export const Navigate = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);

  const routes = [
    { id: 1, name: 'No Traffic Route', points: '+150 POINT', type: 'no-traffic' },
    { id: 2, name: 'Economical Route', points: '+50 POINT', type: 'economical' },
    { id: 3, name: 'Default Route', points: '-50 POINT', type: 'default' }
  ];

  return (
    <div className="navigate-page">
      <div className="navigate-container">
        <div className="left-panel">
          <div className="destination-card">
            <h3>Navigating to</h3>
            <div className="destination-input">
              <input 
                type="text" 
                value="City Centre, Mall" 
                readOnly 
              />
            </div>
          </div>

          <div className="routes-list">
            {routes.map((route) => (
              <div 
                key={route.id}
                className={`route-option ${selectedRoute === route.id ? 'selected' : ''}`}
                onClick={() => setSelectedRoute(route.id)}
              >
                <span className="route-name">{route.name}</span>
                <span className={`route-points ${route.points.includes('+') ? 'positive' : 'negative'}`}>
                  {route.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="right-panel">
          <div className="map-interface">
            <h3>Map Interface</h3>
            {/* Map component will go here */}
          </div>
          <button className="go-button">Go</button>
        </div>
      </div>
    </div>
  );
}; 