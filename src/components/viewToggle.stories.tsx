import type { Meta, StoryObj } from '@storybook/react';
import ViewToggle from './viewToggle';
import { Map, Kanban, Grid3X3, List, Calendar, BarChart3 } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof ViewToggle> = {
  title: 'Components/ViewToggle',
  component: ViewToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A view toggle component for switching between different display modes. Features smooth animations, responsive design, and icon support.'
      }
    }
  },
  argTypes: {
    selected: {
      control: 'text',
      description: 'Currently selected view value'
    },
    defaultValue: {
      control: 'text',
      description: 'Default view value when no selection is made'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ViewToggle>;

// Basic Examples
export const TwoOptions: Story = {
  args: {
    options: [
      { value: 'grid', label: 'Grid View', icon: <Grid3X3 className="h-4 w-4" /> },
      { value: 'list', label: 'List View', icon: <List className="h-4 w-4" /> }
    ],
    selected: 'grid',
    onChange: (view) => console.log('Selected:', view)
  }
};

export const ThreeOptions: Story = {
  args: {
    options: [
      { value: 'floor_plan', label: 'Floor Plan', icon: <Map className="h-4 w-4" /> },
      { value: 'kanban', label: 'Kanban', icon: <Kanban className="h-4 w-4" /> },
      { value: 'calendar', label: 'Calendar', icon: <Calendar className="h-4 w-4" /> }
    ],
    selected: 'floor_plan',
    onChange: (view) => console.log('Selected:', view)
  }
};

export const FourOptions: Story = {
  args: {
    options: [
      { value: 'map', label: 'Map View', icon: <Map className="h-4 w-4" /> },
      { value: 'grid', label: 'Grid View', icon: <Grid3X3 className="h-4 w-4" /> },
      { value: 'list', label: 'List View', icon: <List className="h-4 w-4" /> },
      { value: 'chart', label: 'Chart View', icon: <BarChart3 className="h-4 w-4" /> }
    ],
    selected: 'map',
    onChange: (view) => console.log('Selected:', view)
  }
};

// Interactive Examples
export const InteractiveExample: Story = {
  render: () => {
    const [selectedView, setSelectedView] = useState('floor_plan');
    
    const options = [
      { value: 'floor_plan', label: 'Floor Plan', icon: <Map className="h-4 w-4" /> },
      { value: 'kanban', label: 'Kanban', icon: <Kanban className="h-4 w-4" /> },
      { value: 'calendar', label: 'Calendar', icon: <Calendar className="h-4 w-4" /> }
    ];

    return (
      <div className="space-y-4">
        <ViewToggle
          options={options}
          selected={selectedView}
          onChange={setSelectedView}
        />
        <div className="text-sm text-gray-600">
          Current view: <span className="font-medium">{selectedView}</span>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing the toggle in action. Click different options to see the animation.'
      }
    }
  }
};

// Construction-specific Examples
export const ProjectViews: Story = {
  render: () => {
    const [view, setView] = useState('floor_plan');
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Project Detail Views</h3>
          <ViewToggle
            options={[
              { value: 'floor_plan', label: 'Floor Plan', icon: <Map className="h-4 w-4" /> },
              { value: 'kanban', label: 'Kanban', icon: <Kanban className="h-4 w-4" /> }
            ]}
            selected={view}
            onChange={setView}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Construction project view toggle as used in the project details page.'
      }
    }
  }
};

export const TaskViews: Story = {
  render: () => {
    const [taskView, setTaskView] = useState('grid');
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Task Display Options</h3>
          <ViewToggle
            options={[
              { value: 'grid', label: 'Grid', icon: <Grid3X3 className="h-4 w-4" /> },
              { value: 'list', label: 'List', icon: <List className="h-4 w-4" /> },
              { value: 'calendar', label: 'Calendar', icon: <Calendar className="h-4 w-4" /> }
            ]}
            selected={taskView}
            onChange={setTaskView}
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Showing tasks in <span className="font-medium">{taskView}</span> view
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Task management view options showing different ways to display construction tasks.'
      }
    }
  }
};

// Responsive Behavior
export const ResponsiveExample: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Mobile View (Icons Only)</h3>
        <div className="max-w-xs">
          <ViewToggle
            options={[
              { value: 'floor_plan', label: 'Floor Plan', icon: <Map className="h-4 w-4" /> },
              { value: 'kanban', label: 'Kanban', icon: <Kanban className="h-4 w-4" /> },
              { value: 'calendar', label: 'Calendar', icon: <Calendar className="h-4 w-4" /> }
            ]}
            selected="floor_plan"
            onChange={() => {}}
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Desktop View (Icons + Labels)</h3>
        <div className="max-w-md">
          <ViewToggle
            options={[
              { value: 'floor_plan', label: 'Floor Plan', icon: <Map className="h-4 w-4" /> },
              { value: 'kanban', label: 'Kanban', icon: <Kanban className="h-4 w-4" /> },
              { value: 'calendar', label: 'Calendar', icon: <Calendar className="h-4 w-4" /> }
            ]}
            selected="floor_plan"
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive behavior - labels are hidden on small screens (sm: breakpoint), showing only icons.'
      }
    }
  }
};

// Text-only Options
export const TextOnly: Story = {
  args: {
    options: [
      { value: 'overview', label: 'Overview' },
      { value: 'details', label: 'Details' },
      { value: 'settings', label: 'Settings' }
    ],
    selected: 'overview',
    onChange: (view) => console.log('Selected:', view)
  },
  parameters: {
    docs: {
      description: {
        story: 'View toggle without icons, using text labels only.'
      }
    }
  }
};

// Multiple Toggles
export const MultipleToggles: Story = {
  render: () => {
    const [mainView, setMainView] = useState('floor_plan');
    const [sortView, setSortView] = useState('priority');
    
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">View Mode</h4>
          <ViewToggle
            options={[
              { value: 'floor_plan', label: 'Floor Plan', icon: <Map className="h-4 w-4" /> },
              { value: 'kanban', label: 'Kanban', icon: <Kanban className="h-4 w-4" /> }
            ]}
            selected={mainView}
            onChange={setMainView}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Sort By</h4>
          <ViewToggle
            options={[
              { value: 'priority', label: 'Priority' },
              { value: 'date', label: 'Date' },
              { value: 'status', label: 'Status' }
            ]}
            selected={sortView}
            onChange={setSortView}
            className="bg-blue-50 border-blue-200"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple toggle components for different purposes, with custom styling on the second toggle.'
      }
    }
  }
};