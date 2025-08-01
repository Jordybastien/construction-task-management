import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

import { cn } from '@/lib/utils';
import { twMerge } from 'tailwind-merge';

const icons = {
  default: Info,
  info: Info,
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  destructive: XCircle,
} as const;

const iconsColorPool = {
  default: '!text-gray-600',
  info: '!text-primary',
  success: '!text-success-600',
  error: '!text-red-600',
  warning: '!text-yellow-600',
  destructive: '!text-red-600',
};

const alertVariants = cva(
  'relative w-full flex flex-col items-start rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10',
        info: 'bg-primary/5 border border-primary/10 text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => {
  const Icon = icons[variant || 'default'];
  const iconClassName = iconsColorPool[variant || 'default'];

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}>
      <Icon className={twMerge('h-5 w-5', iconClassName)} />
      {children}
    </div>
  );
});
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 leading-none font-medium tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed text-left', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
