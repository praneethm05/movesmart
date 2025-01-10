import React from 'react';
import { Fuel, Film, Coffee, ShoppingBag, Car, Gift } from 'lucide-react';
import './Redeem.css';

export const Redeem = () => {
  const rewardCards = [
    {
      id: 1,
      title: 'Fuel Discount',
      description: '₹100 off on fuel at Shell Petrol Stations',
      points: 500,
      icon: <Fuel size={24} />,
      category: 'fuel'
    },
    {
      id: 2,
      title: 'Movie Tickets',
      description: 'Buy 1 Get 1 at PVR Cinemas',
      points: 800,
      icon: <Film size={24} />,
      category: 'entertainment'
    },
    {
      id: 3,
      title: 'Café Voucher',
      description: '50% off at Café Coffee Day',
      points: 300,
      icon: <Coffee size={24} />,
      category: 'food'
    },
    {
      id: 4,
      title: 'Shopping Discount',
      description: '20% off at Central Mall',
      points: 1000,
      icon: <ShoppingBag size={24} />,
      category: 'shopping'
    },
    {
      id: 5,
      title: 'Car Service',
      description: '15% off on car service at AutoCare',
      points: 1200,
      icon: <Car size={24} />,
      category: 'service'
    },
    {
      id: 6,
      title: 'Gift Card',
      description: 'Amazon Gift Card worth ₹500',
      points: 1500,
      icon: <Gift size={24} />,
      category: 'gift'
    }
  ];

  return (
    <div className="redeem-page">
      <div className="redeem-header">
        <h1>Redeem Rewards</h1>
        <div className="points-balance">
          <span>Your Drive Points:</span>
          <span className="points">1800</span>
        </div>
      </div>

      <div className="rewards-grid">
        {rewardCards.map((card) => (
          <div key={card.id} className="reward-card">
            <div className={`card-icon ${card.category}`}>
              {card.icon}
            </div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="card-footer">
                <span className="points-required">{card.points} Points</span>
                <button 
                  className="redeem-btn"
                  disabled={1800 < card.points}
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 