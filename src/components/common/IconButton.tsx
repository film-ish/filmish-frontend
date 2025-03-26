import React from 'react';

interface IconButtonProps {
  className?: string;
  children: React.ReactNode;
  liked: boolean;
  size?: number;
  onClick: () => void;
}

const IconButton = ({ className, children, size = 36, onClick }: IconButtonProps) => {
  const baseStyle =
    'rounded-full flex items-center justify-center transition aspect-square bg-transparent hover:bg-white/50';

  return (
    <button className={`${baseStyle} ${className}`} style={{ width: size }} onClick={onClick}>
      {children}
    </button>
  );
};

export default IconButton;
