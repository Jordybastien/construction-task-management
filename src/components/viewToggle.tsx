import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

interface ViewOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ViewToggleProps {
  options: ViewOption[];
  selected?: string;
  defaultValue?: string;
  onChange: (view: string) => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  options,
  selected,
  defaultValue,
  onChange,
  className = '',
}) => {
  const activeValue = useMemo(() => {
    return selected || defaultValue || options[0]?.value || '';
  }, [selected, defaultValue, options]);

  const activeIndex = options.findIndex(
    (option) => option.value === activeValue
  );

  return (
    <div
      className={twMerge('relative flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1', className)}>
      <div
        className="bg-primary absolute inset-x-1 inset-y-1 rounded-md shadow-sm transition-all duration-200 ease-in-out"
        style={{
          left: `calc(${(activeIndex * 100) / options.length}% + 4px)`, // TODO: fix this hack to align active item, not ideal
          width: `calc(${100 / options.length}% - 8px)`,
        }}
      />

      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={twMerge(
            'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200',
            activeValue === option.value
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900'
          )}>
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;
