import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return <div className={`bg-white shadow rounded ${className}`}>{children}</div>;
};

export const CardContent = ({ children, className = "" }: CardProps) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
