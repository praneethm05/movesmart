import React, { useState } from 'react';
import { User, Award, Clock, MapPin } from 'lucide-react';
import './Profile.css';

export const Profile = () => {
  const [userData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2024',
    totalPoints: 1800,
    driveStreak: 15,
    favoriteRoutes: ['Work', 'Home', 'City Centre'],
    achievements: [
      { id: 1, title: 'Early Bird', description: 'Used optimal time routes 5 days in a row', icon: <Clock size={24} /> },
      { id: 2, title: 'Traffic Navigator', description: 'Avoided heavy traffic 10 times', icon: <MapPin size={24} /> },
      { id: 3, title: 'Point Collector', description: 'Earned 1000+ drive points', icon: <Award size={24} /> }
    ]
  });

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={40} />
        </div>
        <div className="profile-info">
          <h1>{userData.name}</h1>
          <p>{userData.email}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userData.totalPoints}</span>
              <span className="stat-label">Drive Points</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.driveStreak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.favoriteRoutes.length}</span>
              <span className="stat-label">Saved Routes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>Recent Achievements</h2>
        <div className="achievements-grid">
          {userData.achievements.map(achievement => (
            <div key={achievement.id} className="achievement-card">
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              <div className="achievement-info">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 