import type { Meta, StoryObj } from '@storybook/react';
import TaskCard from './taskCard';
import { TaskStatus } from '@/database/schemas/base.schema';
import { TaskWithDetails } from '@/database/dtos/task.dto';

const meta: Meta<typeof TaskCard> = {
  title: 'Containers/TaskCard',
  component: TaskCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Task card component displaying task information including title, status, room assignment, checklist progress, and action menu. Features status indicators, progress circles, and hover effects.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onClick: { action: 'task clicked' },
    onEdit: { action: 'edit clicked' },
    onDelete: { action: 'delete clicked' },
    isSelected: {
      control: 'boolean',
      description: 'Whether the task card is currently selected'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

// Sample task data
const sampleTask: TaskWithDetails = {
  id: '1',
  title: 'Install Main Electrical Panel',
  description: 'Install and configure the main electrical distribution panel in the basement',
  status: TaskStatus.IN_PROGRESS,
  priority: 'high',
  assigned_to: 'john-smith',
  room_id: 'room-1',
  room_name: 'Basement Utility Room',
  position_lat: 100,
  position_lng: 200,
  checklist_count: 8,
  completed_checklist_count: 5,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-20T14:30:00Z',
  created_by: 'user-1'
};

// Basic Status Examples
export const NotStarted: Story = {
  args: {
    task: {
      ...sampleTask,
      title: 'Prepare Foundation Forms',
      status: TaskStatus.NOT_STARTED,
      checklist_count: 6,
      completed_checklist_count: 0,
      room_name: 'Excavation Area'
    }
  }
};

export const InProgress: Story = {
  args: {
    task: sampleTask
  }
};

export const Blocked: Story = {
  args: {
    task: {
      ...sampleTask,
      title: 'Install Plumbing Fixtures',
      status: TaskStatus.BLOCKED,
      checklist_count: 12,
      completed_checklist_count: 3,
      room_name: 'Second Floor Bathroom'
    }
  }
};

export const FinalCheck: Story = {
  args: {
    task: {
      ...sampleTask,
      title: 'Paint Interior Walls',
      status: TaskStatus.FINAL_CHECK,
      checklist_count: 10,
      completed_checklist_count: 9,
      room_name: 'Conference Room A'
    }
  }
};

export const Done: Story = {
  args: {
    task: {
      ...sampleTask,
      title: 'Install Door Hardware',
      status: TaskStatus.DONE,
      checklist_count: 4,
      completed_checklist_count: 4,
      room_name: 'Main Entrance'
    }
  }
};

// Progress Variations
export const NoChecklist: Story = {
  args: {
    task: {
      ...sampleTask,
      title: 'Site Inspection',
      checklist_count: 0,
      completed_checklist_count: 0,
      room_name: 'Entire Site'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Task with no checklist items - shows 0% progress.'
      }
    }
  }
};

export const LowProgress: Story = {
  args: {
    task: {
      ...sampleTask,
      title: 'HVAC Installation',
      checklist_count: 15,
      completed_checklist_count: 2,
      room_name: 'Mechanical Room'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Task with low progress (13% complete).'
      }
    }
  }
};

export const HighProgress: Story = {
  args: {
    task: {
      ...sampleTask,
      title: 'Flooring Installation',
      checklist_count: 12,
      completed_checklist_count: 11,
      room_name: 'Main Lobby'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Task with high progress (92% complete).'
      }
    }
  }
};

// Selected State
export const Selected: Story = {
  args: {
    task: sampleTask,
    isSelected: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Task card in selected state with blue ring border.'
      }
    }
  }
};

// Real Construction Examples
export const ConstructionTasks: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <TaskCard
        task={{
          ...sampleTask,
          title: 'Pour Concrete Foundation',
          status: TaskStatus.DONE,
          checklist_count: 8,
          completed_checklist_count: 8,
          room_name: 'Foundation Area'
        }}
        onClick={() => console.log('Task clicked')}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      
      <TaskCard
        task={{
          ...sampleTask,
          id: '2',
          title: 'Frame Interior Walls',
          status: TaskStatus.IN_PROGRESS,
          checklist_count: 24,
          completed_checklist_count: 16,
          room_name: 'First Floor'
        }}
        onClick={() => console.log('Task clicked')}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      
      <TaskCard
        task={{
          ...sampleTask,
          id: '3',
          title: 'Install Electrical Wiring',
          status: TaskStatus.BLOCKED,
          checklist_count: 18,
          completed_checklist_count: 7,
          room_name: 'Multiple Rooms'
        }}
        onClick={() => console.log('Task clicked')}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      
      <TaskCard
        task={{
          ...sampleTask,
          id: '4',
          title: 'Paint Ceiling',
          status: TaskStatus.FINAL_CHECK,
          checklist_count: 6,
          completed_checklist_count: 6,
          room_name: 'Conference Room'
        }}
        onClick={() => console.log('Task clicked')}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      
      <TaskCard
        task={{
          ...sampleTask,
          id: '5',
          title: 'Install Bathroom Fixtures',
          status: TaskStatus.NOT_STARTED,
          checklist_count: 14,
          completed_checklist_count: 0,
          room_name: 'Restroom B'
        }}
        onClick={() => console.log('Task clicked')}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      
      <TaskCard
        task={{
          ...sampleTask,
          id: '6',
          title: 'Security System Setup',
          status: TaskStatus.IN_PROGRESS,
          checklist_count: 22,
          completed_checklist_count: 13,
          room_name: 'Main Entrance'
        }}
        onClick={() => console.log('Task clicked')}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A grid of real construction task examples showing different statuses, progress levels, and room assignments.'
      }
    }
  }
};

// Long Task Names
export const LongTaskName: Story = {
  args: {
    task: {
      ...sampleTask,
      title: 'Install High-Efficiency HVAC System with Smart Temperature Controls and Air Quality Monitoring',
      room_name: 'Mechanical Equipment Room'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Task card with a very long task name demonstrating text wrapping behavior.'
      }
    }
  }
};

// No Room Assignment
export const NoRoom: Story = {
  args: {
    task: {
      ...sampleTask,
      title: 'Site Survey and Documentation',
      room_name: null
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Task without a room assignment showing fallback text.'
      }
    }
  }
};

// Interactive Examples
export const WithActions: Story = {
  args: {
    task: sampleTask,
    onClick: () => {
      alert('Task details opened');
    },
    onEdit: (id: string) => {
      alert(`Edit task ${id}`);
    },
    onDelete: (id: string) => {
      alert(`Delete task ${id}`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Task card with working click and action handlers. Click the card or menu to test.'
      }
    }
  }
};

// Status Showcase
export const AllStatuses: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <TaskCard
        task={{
          ...sampleTask,
          title: 'Not Started Task',
          status: TaskStatus.NOT_STARTED,
          checklist_count: 5,
          completed_checklist_count: 0
        }}
      />
      
      <TaskCard
        task={{
          ...sampleTask,
          title: 'In Progress Task',
          status: TaskStatus.IN_PROGRESS,
          checklist_count: 8,
          completed_checklist_count: 3
        }}
      />
      
      <TaskCard
        task={{
          ...sampleTask,
          title: 'Blocked Task',
          status: TaskStatus.BLOCKED,
          checklist_count: 6,
          completed_checklist_count: 2
        }}
      />
      
      <TaskCard
        task={{
          ...sampleTask,
          title: 'Final Check Task',
          status: TaskStatus.FINAL_CHECK,
          checklist_count: 4,
          completed_checklist_count: 4
        }}
      />
      
      <TaskCard
        task={{
          ...sampleTask,
          title: 'Completed Task',
          status: TaskStatus.DONE,
          checklist_count: 10,
          completed_checklist_count: 10
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available task statuses with their corresponding status indicator colors.'
      }
    }
  }
};

// Task List Context
export const TaskList: Story = {
  render: () => (
    <div className="space-y-3 max-w-md">
      <h3 className="font-medium text-gray-900">Ground Floor Tasks</h3>
      <div className="space-y-2">
        <TaskCard
          task={{
            ...sampleTask,
            title: 'Install Door Frames',
            status: TaskStatus.DONE,
            checklist_count: 6,
            completed_checklist_count: 6,
            room_name: 'All Rooms'
          }}
          isSelected={false}
        />
        
        <TaskCard
          task={{
            ...sampleTask,
            id: '2',
            title: 'Electrical Panel Wiring',
            status: TaskStatus.IN_PROGRESS,
            checklist_count: 12,
            completed_checklist_count: 8,
            room_name: 'Utility Room'
          }}
          isSelected={true}
        />
        
        <TaskCard
          task={{
            ...sampleTask,
            id: '3',
            title: 'Install Light Fixtures',
            status: TaskStatus.NOT_STARTED,
            checklist_count: 15,
            completed_checklist_count: 0,
            room_name: 'Office Areas'
          }}
          isSelected={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Task cards shown in a list context with one selected item, as they appear in the task management interface.'
      }
    }
  }
};