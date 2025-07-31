import React from 'react';
import { twMerge } from 'tailwind-merge';

export type PillStatus = 'success' | 'danger' | 'purple' | 'unknown' | 'warning';

interface StatusIndicatorDotProps {
  status?: PillStatus;
  className?: string;
}

const statusStyles: Record<PillStatus | 'default', { bg: string; border: string }> =
  {
    default: {
      bg: 'bg-white',
      border: 'border-gray-100',
    },
    success: {
      bg: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
    danger: {
      bg: 'bg-red-500',
      border: 'border-red-200',
    },
    warning: {
      bg: 'bg-yellow-500',
      border: 'border-yellow-200',
    },
    purple: {
      bg: 'bg-purple-600',
      border: 'border-purple-200',
    },
    unknown: {
      bg: 'bg-white',
      border: 'border-gray-100',
    },
  };

const StatusIndicatorDot: React.FC<StatusIndicatorDotProps> = ({
  status,
  className,
}) => {
  const styles = statusStyles[status || 'default'];
  return (
    <div
      className={twMerge(
        'h-[14px] w-[14px] rounded-full border-2',
        styles.bg,
        styles.border,
        className
      )}
    />
  );
};

export default StatusIndicatorDot;

export const PillStatusIndicator = ({
  variant,
  label,
  bordered = false,
  labelClassNames,
  containerClassNames,
}: {
  variant: PillStatus;
  label: string;
  bordered?: boolean;
  containerClassNames?: string;
  labelClassNames?: string;
}) => (
  <div
    className={twMerge(
      'flex flex-row items-center gap-x-1 rounded-xl px-2 py-1',
      bordered && 'border border-solid border-gray-200 bg-gray-50 shadow-sm w-fit',
      containerClassNames
    )}>
    <StatusIndicatorDot status={variant} />
    <span
      className={twMerge(
        'font-segoe-regular text-sm text-gray-600 capitalize',
        labelClassNames
      )}>
      {label}
    </span>
  </div>
);
