import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Download, Plus, Trash2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and loading states. Built on top of Radix UI Slot for composition flexibility.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'tertiary', 'ghost', 'link'],
      description: 'Visual style variant of the button'
    },
    size: {
      control: 'select', 
      options: ['default', 'sm', 'lg', 'icon', 'full'],
      description: 'Size variant of the button'
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables the button'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button interaction'
    },
    asChild: {
      control: 'boolean',
      description: 'Renders as child element instead of button element'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic variants
export const Default: Story = {
  args: {
    children: 'Create Project',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Task',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Cancel',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Save Draft',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'View Details',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Edit',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Learn more',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const FullWidth: Story = {
  args: {
    size: 'full',
    children: 'Full Width Button',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

// With icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus />
        Add Task
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Download />,
  },
};

export const DestructiveWithIcon: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <Trash2 />
        Delete
      </>
    ),
  },
};

// States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Creating...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// Construction-specific examples
export const ConstructionExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex gap-2">
        <Button>
          <Plus />
          Create Project
        </Button>
        <Button variant="outline">
          <Download />
          Export Plans
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button variant="secondary" size="sm">
          Save Task
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 />
          Delete
        </Button>
      </div>
      
      <div className="flex gap-2 items-center">
        <Button variant="tertiary">View Floor Plan</Button>
        <Button variant="ghost" size="icon">
          <Download />
        </Button>
      </div>
      
      <Button loading size="full">
        Creating Project...
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world button combinations used throughout the Construction Task Manager application.'
      }
    }
  }
};