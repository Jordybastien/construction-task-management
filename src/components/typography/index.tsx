import { twMerge } from 'tailwind-merge';
import React, { ReactNode, createElement } from 'react';
import { Badge } from '@/components/ui/badge';

type ComponentType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span';

type TypographyProps = {
  as?: ComponentType;
  children?: ReactNode;
  className?: string;
  rawHtml?: string;
  variant?: 'primary' | 'secondary';
};

const Typography: React.FC<TypographyProps> = ({
  as: Component = 'p',
  children,
  className,
  rawHtml,
  variant = 'primary',
}) => {
  const baseClasses = {
    h1: 'text-3xl font-semibold text-primary-txt',
    h2: 'text-2xl font-semibold text-primary-txt',
    h3: 'text-lg font-semibold text-primary-txt',
    h4: 'text-base text-primary-txt font-medium',
    h5: '',
    p: 'text-base font-normal text-secondary-txt',
    span: 'text-sm font-normal text-secondary-txt',
  };

  const variantClasses = {
    primary: '',
    secondary: '',
    danger: '',
    success: '',
  };

  const combinedClasses = twMerge(
    baseClasses[Component],
    variantClasses[variant],
    className
  );

  if (rawHtml) {
    return React.createElement(Component, {
      className: combinedClasses,
      dangerouslySetInnerHTML: { __html: rawHtml },
    });
  }

  return createElement(Component, { className: combinedClasses }, children);
};

export default Typography;

export type TextElement = {
  text: string;
  as: ComponentType;
  className?: string;
};

type GroupedTypographyProps = {
  title: TextElement;
  subtext?: TextElement;
  className?: string;
  count?: number;
};

export const GroupedTypography: React.FC<GroupedTypographyProps> = ({
  title,
  subtext,
  className,
  count
}) => (
  <div className={twMerge('flex flex-col', className)}>
    <div className='flex flex-row items-center gap-x-2'>
      <Typography as={title.as} className={twMerge(title?.className)}>
        {title.text}
      </Typography>
      {typeof count !== "undefined" && <Badge showIcon={false}>{count?.toLocaleString()}</Badge>}
    </div>
    {subtext && (
      <Typography as={subtext.as} className={twMerge(subtext?.className)}>
        {subtext.text}
      </Typography>
    )}
  </div>
);
