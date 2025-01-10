import React from "react";

export const Button = ({ children, className, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded font-medium text-white transition ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
