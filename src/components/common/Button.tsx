import React from 'react';

interface ButtonProps {
  className?: string;
  variant?: 'filled' | 'outlined';
  shape?: 'rounded' | 'rounded-full';
  size?: 'small' | 'medium' | 'large';
  bgColor?: 'white' | 'black' | 'gray-6' | 'cherry-blush' | 'rose-cloud';
  textColor?: 'white' | 'gray-4' | 'cherry-blush';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({
  className = '',
  variant = 'filled',
  shape = 'rounded',
  size = 'small',
  bgColor = 'rose-cloud',
  textColor = 'white',
  onClick,
  children,
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  const bgColorVariants = {
    white: 'bg-white',
    black: 'bg-black',
    'gray-6': 'bg-gray-6',
    'cherry-blush': 'bg-cherry-blush',
    'rose-cloud': 'bg-rose-cloud',
  };

  const textColorVariants = {
    white: 'text-white',
    'gray-4': 'text-gray-4',
    'cherry-blush': 'text-cherry-blush',
  };

  const shapeClass = shape === 'rounded-full' ? 'rounded-full' : 'rounded-[10px]';
  const sizeClass = size === 'small' ? 'h-[30px]' : size === 'large' ? 'h-[50px]' : 'h-[40px]';
  const variantClass = variant === 'outlined' ? 'border border-gray-4 text-gray-4 bg-transparent' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const bgColorClass = bgColorVariants[bgColor];
  const textColorClass = textColorVariants[textColor];

  return (
    <button
      type={type}
      disabled={disabled}
      className={`font-medium text-sm transition-all px-[15px] w-fit ${shapeClass} ${sizeClass} ${variantClass} ${bgColorClass} ${textColorClass} ${disabledClass} ${className}`}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
