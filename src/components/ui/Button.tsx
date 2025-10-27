import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', fullWidth = false, children, ...props }) => {
  const baseStyles = `px-4 py-2 rounded focus:outline-none focus:ring font-semibold transition-all duration-300 ${
    fullWidth ? 'w-full' : ''
  }`;

  const variantStyles = variant === 'primary'
    ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300'
    : variant === 'secondary'
      ? 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300'
      : 'bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 text-white hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-md';

  return (
    <button className={`${baseStyles} ${variantStyles}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
