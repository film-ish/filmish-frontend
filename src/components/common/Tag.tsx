import React from 'react';

interface TagProps {
  className?: string;
  variant?: 'filled' | 'outlined';
  shape?: 'rounded' | 'rounded-full';
  size?: 'x-small' | 'small' | 'medium' | 'large';
  bgColor?:
    | 'white'
    | 'white/50'
    | 'black'
    | 'gray-4'
    | 'gray-5'
    | 'gray-6'
    | 'gray-6/40'
    | 'cherry-blush'
    | 'rose-cloud';
  textColor?: 'white' | 'gray-4' | 'cherry-blush';
  opacity?: number;
  onClick: () => void;
  children: React.ReactNode;
}

const Tag = ({
  className = '',
  variant = 'filled',
  shape = 'rounded-full',
  size = 'small',
  bgColor = 'gray-5',
  textColor = 'white',
  children,
}: TagProps) => {
  const bgColorVariants = {
    white: 'bg-white',
    'white/50': 'bg-white/50',
    black: 'bg-black',
    'gray-4': 'bg-gray-4',
    'gray-5': 'bg-gray-5',
    'gray-6': 'bg-gray-6',
    'gray-6/40': 'bg-gray-6/40',
    'cherry-blush': 'bg-cherry-blush',
    'rose-cloud': 'bg-rose-cloud',
  };

  const textColorVariants = {
    white: 'text-white',
    'gray-4': 'text-gray-4',
    'cherry-blush': 'text-cherry-blush',
  };

  const baseStyle = 'font-medium text-sm px-[10px] flex items-center justify-center w-fit';
  const shapeClass = shape === 'rounded-full' ? 'rounded-full' : 'rounded-md';
  const sizeClass = size === 'large' ? 'text-label-xxl px-[25px] py-2' : 'py-1';
  const variantClass = variant === 'outlined' ? 'border border-gray-4 text-gray-4' : '';

  const bgColorClass = bgColorVariants[bgColor];
  const textColorClass = textColorVariants[textColor];

  return (
    <div
      className={`${baseStyle} ${shapeClass} ${sizeClass} ${variantClass} ${bgColorClass} ${textColorClass} ${className}`}>
      {children}
    </div>
  );
};

export default Tag;
