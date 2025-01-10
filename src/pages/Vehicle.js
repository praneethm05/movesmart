import React, { useState, useEffect } from 'react';
import { Plus, Car, Fuel, Trash2 } from 'lucide-react';
import { vehicleService } from '../services/api';
import './Vehicle.css';

const VehicleCard = ({ id, type, name, license_plate, year_of_manufacture, mileage, onDelete }) => (
  <div className="vehicle-card">
    <Car size={24} className="vehicle-icon" />
    <div className="vehicle-info">
      <div className="vehicle-header">
        <h3 className="vehicle-name">{name}</h3>
        <button 
          className="delete-btn" 
          onClick={() => onDelete(id)}
          aria-label="Delete vehicle"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <p className="vehicle-type">{type}</p>
      <div className="vehicle-details">
        <p className="license-plate">License: {license_plate}</p>
        <p className="manufacture-year">Year: {year_of_manufacture}</p>
        <div className="mileage-info">
          <Fuel size={16} />
          <span>{mileage} km/L</span>
        </div>
      </div>
    </div>
  </div>
);

const defaultVehicle = {
  type: 'Sedan',
  name: 'Default Vehicle',
  license_plate: 'NA',
  year_of_manufacture: new Date().getFullYear().toString(),
  mileage: 15.0
};

export const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicle_type: 'Sedan',
    vehicle_name: '',
    license_plate: '',
    year_of_manufacture: new Date().getFullYear().toString(),
    mileage: 15.0
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      console.log('Fetching vehicles...');
      const response = await vehicleService.getAllVehicles();
      console.log('API Response:', response);
      const data = response.data;
      
      // Transform API data to match our component structure
      const transformedData = data.map(vehicle => ({
        id: vehicle.vehicle_id,
        type: vehicle.vehicle_type,
        name: vehicle.vehicle_name,
        license_plate: vehicle.license_plate,
        year_of_manufacture: vehicle.year_of_manufacture,
        mileage: vehicle.mileage
      }));
      
      setVehicles(transformedData.length > 0 ? transformedData : [defaultVehicle]);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setVehicles([defaultVehicle]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    
    try {
      // First, validate all required fields
      if (!newVehicle.vehicle_name?.trim()) {
        alert('Vehicle name is required');
        return;
      }
      if (!newVehicle.license_plate?.trim()) {
        alert('License plate is required');
        return;
      }
      if (!newVehicle.year_of_manufacture) {
        alert('Year of manufacture is required');
        return;
      }

      // Format and validate year
      const yearValue = newVehicle.year_of_manufacture.toString().trim();
      const yearNum = parseInt(yearValue);
      const currentYear = new Date().getFullYear();
      
      if (!/^\d{4}$/.test(yearValue) || yearNum < 1900 || yearNum > currentYear) {
        alert(`Please enter a valid year between 1900 and ${currentYear}`);
        return;
      }

      // Prepare data with all required fields
      const vehicleData = {
        vehicle_id: `VEH${Date.now()}`,
        user_id: "1",
        vehicle_type: newVehicle.vehicle_type || 'Sedan',
        vehicle_name: newVehicle.vehicle_name.trim(),
        license_plate: newVehicle.license_plate.toUpperCase().trim(),
        year_of_manufacture: yearValue,  // Make sure this is a string
        mileage: parseFloat(newVehicle.mileage) || 15.0
      };
      
      // Debug log to verify data
      console.log('Submitting vehicle data:', vehicleData);

      const response = await vehicleService.addVehicle(vehicleData);
      
      if (response && response.data) {
        // Reset form
        setNewVehicle({
          vehicle_type: 'Sedan',
          vehicle_name: '',
          license_plate: '',
          year_of_manufacture: new Date().getFullYear().toString(),
          mileage: 15.0
        });
        
        // Close the modal
        setShowAddForm(false);
        
        // Reload vehicles
        await fetchVehicles();  // Call the existing fetchVehicles function
        
        // Optional: Show success message
        alert('Vehicle added successfully!');
      }
    } catch (error) {
      console.error('Submission error:', {
        formData: newVehicle,
        error: error.message,
        response: error.response?.data
      });
      
      alert(error.response?.data?.message || 'Failed to add vehicle. Please check all fields.');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleService.deleteVehicle(id);
        // Refresh the vehicles list
        await fetchVehicles();
        alert('Vehicle deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete vehicle. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading vehicles...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Vehicles</h1>
        <button 
          className="add-vehicle-btn"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      <div className="vehicles-grid">
        {vehicles.map((vehicle, index) => (
          <VehicleCard 
            key={vehicle.id || index} 
            {...vehicle} 
            onDelete={handleDeleteVehicle}
          />
        ))}
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="add-vehicle-modal">
            <h2>Add New Vehicle</h2>
            <form onSubmit={handleAddVehicle}>
              <div className="form-group">
                <label>Vehicle Type</label>
                <input
                  type="text"
                  placeholder="e.g., Sedan, SUV"
                  value={newVehicle.vehicle_type}
                  onChange={(e) => setNewVehicle({...newVehicle, vehicle_type: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vehicle Name</label>
                <input
                  type="text"
                  placeholder="e.g., Honda City"
                  value={newVehicle.vehicle_name}
                  onChange={(e) => setNewVehicle({...newVehicle, vehicle_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>License Plate</label>
                <input
                  type="text"
                  placeholder="e.g., KA-01-AB-1234"
                  value={newVehicle.license_plate}
                  onChange={(e) => setNewVehicle({...newVehicle, license_plate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Year of Manufacture*</label>
                <input
                  type="text"
                  pattern="\d{4}"
                  placeholder="YYYY"
                  value={newVehicle.year_of_manufacture}
                  onChange={(e) => {
                    // Only allow digits and limit to 4 characters
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setNewVehicle(prev => ({
                      ...prev,
                      year_of_manufacture: value
                    }));
                  }}
                  required
                />
                <small className="form-hint">Enter a 4-digit year (1900-{new Date().getFullYear()})</small>
              </div>
              <div className="form-group">
                <label>Mileage (km/L)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g., 15.0"
                  value={newVehicle.mileage}
                  onChange={(e) => setNewVehicle({...newVehicle, mileage: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Add Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 