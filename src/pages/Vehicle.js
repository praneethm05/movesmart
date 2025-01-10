import React, { useState } from 'react';
import { Plus, Car, Fuel } from 'lucide-react';
import './Vehicle.css';

const VehicleCard = ({ type, name, mileage }) => (
  <div className="vehicle-card">
    <Car size={24} className="vehicle-icon" />
    <div className="vehicle-info">
      <h3>{name}</h3>
      <p className="vehicle-type">{type}</p>
      <div className="mileage-info">
        <Fuel size={16} />
        <span>{mileage} km/L</span>
      </div>
    </div>
  </div>
);

export const Vehicle = () => {
  const [vehicles, setVehicles] = useState([
    { id: 1, type: 'Sedan', name: 'Honda City', mileage: '18.4' },
    { id: 2, type: 'SUV', name: 'Hyundai Creta', mileage: '16.8' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    type: '',
    name: '',
    mileage: ''
  });

  const handleAddVehicle = (e) => {
    e.preventDefault();
    setVehicles([...vehicles, { ...newVehicle, id: Date.now() }]);
    setNewVehicle({ type: '', name: '', mileage: '' });
    setShowAddForm(false);
  };

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
        {vehicles.map(vehicle => (
          <VehicleCard key={vehicle.id} {...vehicle} />
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
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vehicle Name</label>
                <input
                  type="text"
                  placeholder="e.g., Honda City"
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mileage (km/L)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 18.5"
                  value={newVehicle.mileage}
                  onChange={(e) => setNewVehicle({...newVehicle, mileage: e.target.value})}
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