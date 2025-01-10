import React, { useState, useEffect } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { useLoadScript, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { trafficService, routeService } from '../services/api';
import './Navigate.css';

export const Navigate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 12.9141, lng: 74.8560 });
  const [directions, setDirections] = useState(null);
  const [destination, setDestination] = useState(location.state?.destination || "City Centre, Mall");
  const [routeDetails, setRouteDetails] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const routes = [
    { id: 1, name: 'No Traffic Route', points: '+150 POINT', type: 'no-traffic', mode: 'LESS_TRAFFIC' },
    { id: 2, name: 'Economical Route', points: '+50 POINT', type: 'economical', mode: 'LESS_FUEL' },
    { id: 3, name: 'Default Route', points: '-50 POINT', type: 'default', mode: 'FASTEST' }
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          if (destination) {
            calculateRoute(pos, destination);
          }
        },
        (error) => console.error('Error getting location:', error)
      );
    }
  }, [destination]);

  const calculateRoute = async (origin, dest) => {
    const directionsService = new window.google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin: origin,
        destination: dest,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
      });

      setDirections(result);
      
      // Get traffic info for the route
      const trafficInfo = await trafficService.getTrafficInfo(
        `${origin.lat},${origin.lng}`,
        dest
      );

      setRouteDetails(trafficInfo);
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  const handleStartNavigation = async () => {
    if (!selectedRoute || !destination) {
      alert('Please select a route first');
      return;
    }

    try {
      // Save route to database
      const routeData = {
        title: destination,
        start_location: `${userLocation.lat},${userLocation.lng}`,
        end_location: destination,
        route_type: routes.find(r => r.id === selectedRoute)?.type
      };

      await routeService.createRoute(routeData);
      navigate('/dashboard', { 
        state: { 
          message: 'Route started successfully!',
          routeDetails: routeDetails 
        }
      });
    } catch (error) {
      console.error('Error starting navigation:', error);
      alert('Failed to start navigation. Please try again.');
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="navigate-page">
      <div className="navigate-container">
        <div className="left-panel">
          <div className="destination-card">
            <h3>Navigating to</h3>
            <div className="destination-input">
              <MapPin size={20} />
              <input 
                type="text" 
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  calculateRoute(userLocation, e.target.value);
                }}
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
            <GoogleMap
              mapContainerStyle={{
                width: '100%',
                height: '100%',
                borderRadius: '24px'
              }}
              center={userLocation}
              zoom={14}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              <Marker position={userLocation} />
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    suppressMarkers: false,
                    polylineOptions: {
                      strokeColor: selectedRoute === 1 ? "#22C55E" : 
                                 selectedRoute === 2 ? "#F59E0B" : 
                                 "#EF4444"
                    }
                  }}
                />
              )}
            </GoogleMap>
          </div>
          <button 
            className="go-button"
            onClick={handleStartNavigation}
            disabled={!selectedRoute || !destination}
          >
            Start Navigation <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}; 