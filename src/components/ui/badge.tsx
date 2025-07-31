import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  Info,
  AlertTriangle,
  XCircle,
  BadgeInfo,
  Circle,
  ShieldAlert,
  CircleCheck,
} from 'lucide-react';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

const badgeVariants = cva(
  'inline-flex items-center border justify-center rounded-md border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-purple-50/50 text-purple-600 [a&]:hover:bg-primary/90 border-purple-100',
        success:
          'border-transparent bg-green-50/50 text-green-600 border-green-100',
        warning:
          'border-transparent bg-yellow-50 text-yellow-600 border-yellow-100',
        error: 'border-transparent bg-red-50/50 text-red-600 border-red-100',
        info: 'border-transparent bg-purple-50/50 text-purple-600 border-purple-100',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const variantIcons: Record<BadgeVariant, React.ReactNode> = {
  default: <BadgeInfo />,
  success: <CircleCheck />,
  warning: <AlertTriangle />,
  error: <XCircle />,
  info: <Info />,
  secondary: <Circle />,
  destructive: <ShieldAlert />,
  outline: null,
};

function Badge({
  className,
  variant = 'default',
  asChild = false,
  showIcon = true,
  children,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    showIcon?: boolean;
  }) {
  const Comp = asChild ? Slot : 'span';
  const selectedIcon = variant ? variantIcons[variant] : <Info />
  const Icon = showIcon ? selectedIcon : <></>;

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}>
      {Icon}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };
export type { BadgeVariant };
