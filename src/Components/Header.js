import React from "react";
import "./Header.css";

const Header = ({ user }) => {
  return (
    <header className="header">
      <h1>Move Smart 🚗</h1>
      <div className="user-info">
        <img src={user.profile_picture} alt="Profile" className="profile-pic" />
        <p>{user.name}</p>
        <p>Drive Points: {user.drive_points}</p>
      </div>
    </header>
  );
};

export default Header;
