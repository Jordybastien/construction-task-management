import type { Meta, StoryObj } from '@storybook/react';
import StatusIndicatorDot, { PillStatusIndicator, PillStatus } from './index';

const meta: Meta<typeof StatusIndicatorDot> = {
  title: 'Components/StatusIndicator',
  component: StatusIndicatorDot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Status indicator components for showing task states, progress, and priority levels throughout the construction management system.'
      }
    }
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'danger', 'warning', 'purple', 'unknown'],
      description: 'Visual status variant'
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatusIndicatorDot>;

// Basic Dot Indicators
export const SuccessDot: Story = {
  args: {
    status: 'success',
  },
};

export const DangerDot: Story = {
  args: {
    status: 'danger',
  },
};

export const WarningDot: Story = {
  args: {
    status: 'warning',
  },
};

export const PurpleDot: Story = {
  args: {
    status: 'purple',
  },
};

export const UnknownDot: Story = {
  args: {
    status: 'unknown',
  },
};

// All Dot Variants
export const AllDotVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <StatusIndicatorDot status="success" />
        <span className="text-xs text-muted-foreground">Success</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StatusIndicatorDot status="danger" />
        <span className="text-xs text-muted-foreground">Danger</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StatusIndicatorDot status="warning" />
        <span className="text-xs text-muted-foreground">Warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StatusIndicatorDot status="purple" />
        <span className="text-xs text-muted-foreground">Purple</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StatusIndicatorDot status="unknown" />
        <span className="text-xs text-muted-foreground">Unknown</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available dot indicator variants for quick reference.'
      }
    }
  }
};

// Pill Status Indicators
const PillMeta: Meta<typeof PillStatusIndicator> = {
  title: 'Components/StatusIndicator',
  component: PillStatusIndicator,
};

export const BasicPill: StoryObj<typeof PillStatusIndicator> = {
  render: () => (
    <PillStatusIndicator variant="success" label="Completed" />
  ),
};

export const BorderedPill: StoryObj<typeof PillStatusIndicator> = {
  render: () => (
    <PillStatusIndicator variant="warning" label="In Progress" bordered />
  ),
};

export const AllPillVariants: StoryObj<typeof PillStatusIndicator> = {
  render: () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <PillStatusIndicator variant="success" label="Completed" />
        <PillStatusIndicator variant="danger" label="Failed" />
        <PillStatusIndicator variant="warning" label="In Progress" />
        <PillStatusIndicator variant="purple" label="Review" />
        <PillStatusIndicator variant="unknown" label="Not Started" />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <PillStatusIndicator variant="success" label="Completed" bordered />
        <PillStatusIndicator variant="danger" label="Failed" bordered />
        <PillStatusIndicator variant="warning" label="In Progress" bordered />
        <PillStatusIndicator variant="purple" label="Review" bordered />
        <PillStatusIndicator variant="unknown" label="Not Started" bordered />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All pill status variants shown with and without borders.'
      }
    }
  }
};

// Construction-specific examples
export const TaskStatusExamples: StoryObj<typeof PillStatusIndicator> = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Task Status Indicators</h3>
        <div className="flex flex-wrap gap-2">
          <PillStatusIndicator variant="unknown" label="Not Started" bordered />
          <PillStatusIndicator variant="warning" label="In Progress" bordered />
          <PillStatusIndicator variant="danger" label="Blocked" bordered />
          <PillStatusIndicator variant="purple" label="Final Check" bordered />
          <PillStatusIndicator variant="success" label="Done" bordered />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Priority Levels</h3>
        <div className="flex flex-wrap gap-2">
          <PillStatusIndicator variant="danger" label="High Priority" />
          <PillStatusIndicator variant="warning" label="Medium Priority" />
          <PillStatusIndicator variant="success" label="Low Priority" />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Project Status</h3>
        <div className="flex flex-wrap gap-2">
          <PillStatusIndicator variant="purple" label="Planning" bordered />
          <PillStatusIndicator variant="warning" label="In Progress" bordered />
          <PillStatusIndicator variant="success" label="Completed" bordered />
          <PillStatusIndicator variant="danger" label="On Hold" bordered />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world status indicators used in the construction task management system for tasks, priorities, and projects.'
      }
    }
  }
};

// Custom styling examples
export const CustomStyling: StoryObj<typeof StatusIndicatorDot> = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Custom Dot Sizes</h3>
        <div className="flex items-center gap-4">
          <StatusIndicatorDot status="success" className="h-3 w-3" />
          <StatusIndicatorDot status="warning" />
          <StatusIndicatorDot status="danger" className="h-5 w-5" />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Custom Pill Styling</h3>
        <div className="flex flex-wrap gap-2">
          <PillStatusIndicator 
            variant="success" 
            label="Custom Style" 
            containerClassNames="bg-green-50 border-green-200"
            labelClassNames="text-green-800 font-medium"
            bordered 
          />
          <PillStatusIndicator 
            variant="danger" 
            label="Critical" 
            containerClassNames="bg-red-100 border-red-300 px-3 py-1.5"
            labelClassNames="text-red-900 font-semibold text-xs uppercase tracking-wide"
            bordered 
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of customizing the status indicators with different sizes and styling.'
      }
    }
  }
};