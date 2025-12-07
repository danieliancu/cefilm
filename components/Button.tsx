import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded uppercase tracking-widest font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cinema-font";
  
  const variants = {
    primary: "bg-red-800 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(153,27,27,0.5)] border border-red-900",
    secondary: "bg-amber-600 hover:bg-amber-500 text-black border border-amber-700",
    outline: "bg-transparent border-2 border-amber-600/50 text-amber-500 hover:border-amber-500 hover:text-amber-400 hover:bg-amber-900/10"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};