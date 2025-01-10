import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      console.log('Attempting to fetch address for:', { latitude, longitude });
      
      // Add headers and delay to comply with Nominatim usage policy
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'MoveSmart Traffic Dashboard'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw address data:', data);

      // More detailed address parsing
      const addressInfo = {
        city: data.address?.city || 
              data.address?.town || 
              data.address?.municipality ||
              'Unknown City',
        area: data.address?.suburb || 
              data.address?.neighbourhood || 
              data.address?.road ||
              'Unknown Area',
        fullAddress: data.display_name,
        state: data.address?.state,
        country: data.address?.country
      };

      console.log('Parsed address info:', addressInfo);
      return addressInfo;
    } catch (error) {
      console.error('Error in getAddressFromCoords:', error);
      return null;
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        console.log('Starting location initialization...');
        
        // First, get the position
        const position = await getCurrentPosition();
        console.log('Received position:', position);

        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        console.log('Set location state:', { latitude, longitude });

        // Then, get the address
        const addressData = await getAddressFromCoords(latitude, longitude);
        if (addressData) {
          setAddress(addressData);
          console.log('Successfully set address:', addressData);
        } else {
          throw new Error('Failed to get address from coordinates');
        }

      } catch (err) {
        console.error('Location initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log('Location initialization complete');
      }
    };

    initializeLocation();

    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, []);

  // Debug log for state changes
  useEffect(() => {
    console.log('LocationContext State Updated:', {
      location,
      address,
      loading,
      error,
      timestamp: new Date().toISOString()
    });
  }, [location, address, loading, error]);

  return (
    <LocationContext.Provider value={{ 
      location, 
      address, 
      loading, 
      error,
      // Add a manual refresh function
      refreshLocation: async () => {
        setLoading(true);
        setError(null);
        try {
          const position = await getCurrentPosition();
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          const addressData = await getAddressFromCoords(latitude, longitude);
          if (addressData) {
            setAddress(addressData);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}; 