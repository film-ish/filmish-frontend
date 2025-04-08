import React from 'react';

interface IconButtonProps {
  className?: string;
  children: React.ReactNode;
  liked: boolean;
  size?: number;
  onClick: () => void;
  disabled?: boolean;
}

const IconButton = ({ className, children, size = 36, onClick, disabled = false }: IconButtonProps) => {
  const baseStyle =
    'rounded-full flex items-center justify-center transition aspect-square bg-transparent hover:bg-white/50';

  return (
    <button className={`${className} ${baseStyle}`} style={{ width: size }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default IconButton;
