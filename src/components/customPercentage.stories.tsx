import type { Meta, StoryObj } from '@storybook/react';
import CustomPercentage from './customPercentage';

const meta: Meta<typeof CustomPercentage> = {
  title: 'Components/CustomPercentage',
  component: CustomPercentage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A custom percentage visualization component that displays progress using colored bars. Uses orange for low progress (≤50%), blue for medium (51-75%), and green for high (76-100%).'
      }
    }
  },
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Percentage value to display (0-100)'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomPercentage>;

export const LowProgress: Story = {
  args: {
    percentage: 25,
  },
  parameters: {
    docs: {
      description: {
        story: 'Low progress (≤50%) shown in orange bars.'
      }
    }
  }
};

export const MediumProgress: Story = {
  args: {
    percentage: 65,
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium progress (51-75%) shown in blue bars.'
      }
    }
  }
};

export const HighProgress: Story = {
  args: {
    percentage: 85,
  },
  parameters: {
    docs: {
      description: {
        story: 'High progress (76-100%) shown in green bars.'
      }
    }
  }
};

export const ZeroProgress: Story = {
  args: {
    percentage: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'No progress - all bars remain gray.'
      }
    }
  }
};

export const CompleteProgress: Story = {
  args: {
    percentage: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete progress - all bars are green.'
      }
    }
  }
};

export const ThresholdExamples: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Project Alpha</span>
          <span className="text-orange-600 font-medium">35%</span>
        </div>
        <CustomPercentage percentage={35} />
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Project Beta</span>
          <span className="text-orange-600 font-medium">50%</span>
        </div>
        <CustomPercentage percentage={50} />
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Project Gamma</span>
          <span className="text-blue-600 font-medium">51%</span>
        </div>
        <CustomPercentage percentage={51} />
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Project Delta</span>
          <span className="text-blue-600 font-medium">75%</span>
        </div>
        <CustomPercentage percentage={75} />
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Project Epsilon</span>
          <span className="text-green-600 font-medium">76%</span>
        </div>
        <CustomPercentage percentage={76} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples showing the color thresholds: orange (≤50%), blue (51-75%), and green (76-100%).'
      }
    }
  }
};

export const ConstructionExamples: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium text-gray-900 mb-4">Project Progress Overview</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Foundation Work</span>
              <span className="text-green-600 font-medium">95%</span>
            </div>
            <CustomPercentage percentage={95} />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Electrical Installation</span>
              <span className="text-blue-600 font-medium">68%</span>
            </div>
            <CustomPercentage percentage={68} />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Plumbing</span>
              <span className="text-orange-600 font-medium">42%</span>
            </div>
            <CustomPercentage percentage={42} />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Interior Finishing</span>
              <span className="text-orange-600 font-medium">12%</span>
            </div>
            <CustomPercentage percentage={12} />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world construction project progress tracking with different phases at various completion stages.'
      }
    }
  }
};

export const InteractiveDemo: Story = {
  args: {
    percentage: 50,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - use the percentage control in the controls panel to see how colors change at different thresholds.'
      }
    }
  }
};