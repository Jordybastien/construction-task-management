import React from 'react';

interface CustomPercentageProps {
  percentage: number;
  className?: string;
}

const count = 75;

const CustomPercentage: React.FC<CustomPercentageProps> = ({
  percentage,
  className = '',
}) => {
  const getColorAt = (n: number) =>
    ['bg-orange-500', 'bg-blue-500', 'bg-green-500'][
      n <= 50 ? 0 : n <= 75 ? 1 : 2
    ];

  return (
    <div className={`flex w-full gap-0.5 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-sm ${
            i < Math.floor((percentage / 100) * count)
              ? getColorAt(percentage)
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

export default CustomPercentage;
