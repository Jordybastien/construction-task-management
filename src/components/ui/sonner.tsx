import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
      toastOptions={{
        classNames: {
          title: '!text-gray-600',
          description: '!text-gray-500',
          success: '!text-green-600',
          error: '!text-destructive',
          warning: '!text-yellow-500',
          info: '!text-blue-600',
          closeButton:
            'hover:!bg-gray-100 focus-visible:!ring-none !start-[98.5%]',
        },
        closeButton: true,
      }}
    />
  );
};

export { Toaster };
