import type { Meta, StoryObj } from '@storybook/react';
import ProgressCircle from './progressCircle';

const meta: Meta<typeof ProgressCircle> = {
  title: 'Components/ProgressCircle',
  component: ProgressCircle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A circular progress indicator component with customizable size, colors, and progress values. Perfect for showing task completion, project status, and other progress metrics.'
      }
    }
  },
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100)'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the progress circle'
    },
    strokeColor: {
      control: 'color',
      description: 'Color of the progress stroke'
    },
    backgroundColor: {
      control: 'color',
      description: 'Color of the background circle'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProgressCircle>;

// Basic Examples
export const Default: Story = {
  args: {
    progress: 65,
  },
};

export const SmallSize: Story = {
  args: {
    progress: 45,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    progress: 80,
    size: 'lg',
  },
};

// Progress States
export const NoProgress: Story = {
  args: {
    progress: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Circle with no progress - only the background circle is visible.'
      }
    }
  }
};

export const PartialProgress: Story = {
  args: {
    progress: 25,
  },
  parameters: {
    docs: {
      description: {
        story: 'Quarter progress showing a small arc.'
      }
    }
  }
};

export const HalfProgress: Story = {
  args: {
    progress: 50,
  },
  parameters: {
    docs: {
      description: {
        story: 'Half progress creating a semicircle.'
      }
    }
  }
};

export const NearComplete: Story = {
  args: {
    progress: 90,
  },
  parameters: {
    docs: {
      description: {
        story: 'Nearly complete progress with just a small gap remaining.'
      }
    }
  }
};

export const Complete: Story = {
  args: {
    progress: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete progress forming a full circle.'
      }
    }
  }
};

// Size Comparison
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <ProgressCircle progress={75} size="sm" />
        <div className="text-xs text-gray-500 mt-2">Small</div>
      </div>
      <div className="text-center">
        <ProgressCircle progress={75} size="md" />
        <div className="text-xs text-gray-500 mt-2">Medium</div>
      </div>
      <div className="text-center">
        <ProgressCircle progress={75} size="lg" />
        <div className="text-xs text-gray-500 mt-2">Large</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available sizes shown side by side for comparison.'
      }
    }
  }
};

// Custom Colors
export const CustomColors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <ProgressCircle 
          progress={65} 
          strokeColor="#10b981" 
          backgroundColor="#dcfce7"
        />
        <div className="text-xs text-gray-500 mt-2">Success</div>
      </div>
      <div className="text-center">
        <ProgressCircle 
          progress={45} 
          strokeColor="#f59e0b" 
          backgroundColor="#fef3c7"
        />
        <div className="text-xs text-gray-500 mt-2">Warning</div>
      </div>
      <div className="text-center">
        <ProgressCircle 
          progress={25} 
          strokeColor="#ef4444" 
          backgroundColor="#fee2e2"
        />
        <div className="text-xs text-gray-500 mt-2">Danger</div>
      </div>
      <div className="text-center">
        <ProgressCircle 
          progress={80} 
          strokeColor="#3b82f6" 
          backgroundColor="#dbeafe"
        />
        <div className="text-xs text-gray-500 mt-2">Info</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom color combinations for different states and contexts.'
      }
    }
  }
};

// Construction Examples
export const ConstructionExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Task Progress Indicators</h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <ProgressCircle progress={100} strokeColor="#10b981" size="lg" />
            <div className="text-xs font-medium mt-2">Foundation</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
          <div className="text-center">
            <ProgressCircle progress={75} strokeColor="#3b82f6" size="lg" />
            <div className="text-xs font-medium mt-2">Electrical</div>
            <div className="text-xs text-gray-500">75% Done</div>
          </div>
          <div className="text-center">
            <ProgressCircle progress={45} strokeColor="#f59e0b" size="lg" />
            <div className="text-xs font-medium mt-2">Plumbing</div>
            <div className="text-xs text-gray-500">In Progress</div>
          </div>
          <div className="text-center">
            <ProgressCircle progress={15} strokeColor="#ef4444" size="lg" />
            <div className="text-xs font-medium mt-2">Finishing</div>
            <div className="text-xs text-gray-500">Started</div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Project Overview Cards</h3>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Office Building</div>
                <div className="text-xs text-gray-500">24 tasks</div>
              </div>
              <ProgressCircle progress={68} strokeColor="#8b5cf6" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Warehouse</div>
                <div className="text-xs text-gray-500">16 tasks</div>
              </div>
              <ProgressCircle progress={92} strokeColor="#10b981" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Retail Space</div>
                <div className="text-xs text-gray-500">31 tasks</div>
              </div>
              <ProgressCircle progress={34} strokeColor="#f59e0b" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Parking Garage</div>
                <div className="text-xs text-gray-500">8 tasks</div>
              </div>
              <ProgressCircle progress={5} strokeColor="#ef4444" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world construction project examples showing how progress circles are used in task tracking and project overview cards.'
      }
    }
  }
};

// Interactive Demo
export const InteractiveDemo: Story = {
  args: {
    progress: 65,
    size: 'lg',
    strokeColor: '#8b5cf6',
    backgroundColor: '#e5e7eb',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - use the controls panel to adjust progress, size, and colors in real-time.'
      }
    }
  }
};

// Progress Sequence
export const ProgressSequence: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {[0, 20, 40, 60, 80, 100].map((progress) => (
        <div key={progress} className="text-center">
          <ProgressCircle progress={progress} size="md" />
          <div className="text-xs text-gray-500 mt-1">{progress}%</div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress sequence showing different completion stages from 0% to 100%.'
      }
    }
  }
};