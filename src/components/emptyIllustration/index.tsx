import React from 'react';
import Typography from '@/components/typography';
import { Button } from '@/components/ui/button';

type Size = 'sm' | 'md' | 'lg';

const EmptyIllustration = ({
  message,
  size = 'lg',
  title,
  onClick,
  btnLabel = 'Continue',
}: {
  message: string;
  size?: Size;
  title?: string;
  onClick?: () => void;
  btnLabel?: string;
}) => {
  const SIZES = {
    sm: 40,
    md: 80,
    lg: 100,
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 text-center">
      <img
        src="/assets/empty-box.svg"
        width={SIZES[size]}
        height={SIZES[size]}
        alt="empty"
        className="opacity-15"
      />
      {title && <Typography as="h3">{title}</Typography>}
      <Typography as="p">{message}</Typography>
      {onClick && (
        <Button
          className="border-secondary bg-secondary mt-6 rounded-3xl border-2 hover:border-[#CC7A00] hover:bg-[#CC7A00]"
          onClick={() => onClick?.()}>
          {btnLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyIllustration;
