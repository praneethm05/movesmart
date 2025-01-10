import React from 'react';
import './Card.css';

export const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hoverable = false,
  onClick
}) => {
  return (
    <div 
      className={`card card-${variant} ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`card-content ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>{children}</div>
); 