import React from 'react';

interface CustomAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  name,
  size = 'md',
  className = '',
}) => {
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  };

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-md bg-gray-100 ${sizeClasses[size]} ${className} `}>
      <span className="leading-none font-semibold text-gray-700 uppercase">
        {getInitials(name)}
      </span>
    </div>
  );
};

export default CustomAvatar;
