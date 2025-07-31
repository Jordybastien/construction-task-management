import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressCircleProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  strokeColor?: string;
  backgroundColor?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 'md',
  className,
  strokeColor = '#8b5cf6',
  backgroundColor = '#e5e7eb',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = (progress / 100) * circumference;

  return (
    <div className={twMerge('relative', className)}>
      <svg
        className={twMerge(sizeClasses[size], '-rotate-90 transform')}
        viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${progressOffset} ${circumference}`}
        />
      </svg>
    </div>
  );
};

export default ProgressCircle;
