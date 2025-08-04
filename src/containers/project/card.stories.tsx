import type { Meta, StoryObj } from '@storybook/react';
import ProjectCard, { ProjectCardSkeleton } from './card';
import { ProjectStatus } from '@/database/schemas/base.schema';
import { ProjectWithStats } from '@/database/schemas/project.schema';
import { BrowserRouter } from 'react-router';

const meta: Meta<typeof ProjectCard> = {
  title: 'Containers/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Project card component displaying project information including name, status, progress, task count, and last updated time. Features hover effects, status badges, and action dropdown menu.'
      }
    }
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="max-w-sm">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  argTypes: {
    onEdit: { action: 'edit clicked' },
    onDelete: { action: 'delete clicked' }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

// Sample project data
const sampleProject: ProjectWithStats = {
  id: '1',
  name: 'Office Building Renovation',
  description: 'Complete renovation of downtown office building',
  status: ProjectStatus.ACTIVE,
  taskCount: 24,
  progress: 68,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-20T14:30:00Z',
  created_by: 'user-1'
};

// Basic Examples
export const ActiveProject: Story = {
  args: {
    project: sampleProject
  }
};

export const PlanningProject: Story = {
  args: {
    project: {
      ...sampleProject,
      name: 'Warehouse Expansion',
      status: ProjectStatus.PLANNING,
      taskCount: 12,
      progress: 0,
    }
  }
};

export const CompletedProject: Story = {
  args: {
    project: {
      ...sampleProject,
      name: 'Retail Store Build-out',
      status: ProjectStatus.COMPLETED,
      taskCount: 45,
      progress: 100,
    }
  }
};

export const OnHoldProject: Story = {
  args: {
    project: {
      ...sampleProject,
      name: 'Parking Garage Construction',
      status: ProjectStatus.ON_HOLD,
      taskCount: 8,
      progress: 25,
    }
  }
};

// Progress Variations
export const LowProgress: Story = {
  args: {
    project: {
      ...sampleProject,
      name: 'Medical Clinic Setup',
      progress: 15,
      taskCount: 32,
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Project with low progress showing orange progress bars.'
      }
    }
  }
};

export const MediumProgress: Story = {
  args: {
    project: {
      ...sampleProject,
      name: 'Restaurant Renovation',
      progress: 65,
      taskCount: 28,
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Project with medium progress showing blue progress bars.'
      }
    }
  }
};

export const HighProgress: Story = {
  args: {
    project: {
      ...sampleProject,
      name: 'Apartment Complex',
      progress: 85,
      taskCount: 156,
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Project with high progress showing green progress bars.'
      }
    }
  }
};

// Real Construction Examples
export const ConstructionProjects: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <ProjectCard
        project={{
          ...sampleProject,
          name: 'Downtown Office Tower',
          status: ProjectStatus.ACTIVE,
          taskCount: 187,
          progress: 42,
        }}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      
      <ProjectCard
        project={{
          ...sampleProject,
          id: '2',
          name: 'Shopping Mall Renovation',
          status: ProjectStatus.PLANNING,
          taskCount: 298,
          progress: 8,
        }}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      
      <ProjectCard
        project={{
          ...sampleProject,
          id: '3',
          name: 'Residential Complex',
          status: ProjectStatus.COMPLETED,
          taskCount: 124,
          progress: 100,
        }}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      
      <ProjectCard
        project={{
          ...sampleProject,
          id: '4',
          name: 'Industrial Warehouse',
          status: ProjectStatus.ON_HOLD,
          taskCount: 67,
          progress: 35,
        }}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      
      <ProjectCard
        project={{
          ...sampleProject,
          id: '5',
          name: 'Hospital Wing Addition',
          status: ProjectStatus.ACTIVE,
          taskCount: 203,
          progress: 78,
        }}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      
      <ProjectCard
        project={{
          ...sampleProject,
          id: '6',
          name: 'School Cafeteria Upgrade',
          status: ProjectStatus.ACTIVE,
          taskCount: 45,
          progress: 92,
        }}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A grid of real construction project examples showing different statuses, progress levels, and task counts.'
      }
    }
  }
};

// Long Project Names
export const LongProjectName: Story = {
  args: {
    project: {
      ...sampleProject,
      name: 'Multi-Phase Commercial Development with Retail, Office, and Residential Components',
      taskCount: 342,
      progress: 56,
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Project card with a very long name demonstrating text truncation with line-clamp.'
      }
    }
  }
};

// Edge Cases
export const NoTasks: Story = {
  args: {
    project: {
      ...sampleProject,
      name: 'New Project Setup',
      taskCount: 0,
      progress: 0,
      status: ProjectStatus.PLANNING,
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Project with no tasks yet - planning phase.'
      }
    }
  }
};

export const ManyTasks: Story = {
  args: {
    project: {
      ...sampleProject,
      name: 'Large Scale Development',
      taskCount: 1247,
      progress: 34,
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Project with a large number of tasks demonstrating number formatting.'
      }
    }
  }
};

// Loading State
export const LoadingSkeleton: StoryObj<typeof ProjectCardSkeleton> = {
  render: () => <ProjectCardSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Loading skeleton shown while project data is being fetched.'
      }
    }
  }
};

// Multiple Skeletons
export const LoadingGrid: StoryObj<typeof ProjectCardSkeleton> = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grid of loading skeletons as shown on the projects overview page during data fetching.'
      }
    }
  }
};

// Interactive Examples
export const WithActions: Story = {
  args: {
    project: sampleProject,
    onEdit: (id: string) => {
      alert(`Edit project ${id}`);
    },
    onDelete: (id: string) => {
      alert(`Delete project ${id}`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Project card with working edit and delete actions. Click the menu icon to test.'
      }
    }
  }
};

// Status Showcase
export const AllStatuses: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <ProjectCard
        project={{
          ...sampleProject,
          name: 'Planning Phase Project',
          status: ProjectStatus.PLANNING,
          progress: 5,
        }}
      />
      
      <ProjectCard
        project={{
          ...sampleProject,
          name: 'Active Construction',
          status: ProjectStatus.ACTIVE,
          progress: 45,
        }}
      />
      
      <ProjectCard
        project={{
          ...sampleProject,
          name: 'On Hold Project',
          status: ProjectStatus.ON_HOLD,
          progress: 30,
        }}
      />
      
      <ProjectCard
        project={{
          ...sampleProject,
          name: 'Completed Project',
          status: ProjectStatus.COMPLETED,
          progress: 100,
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available project statuses with their corresponding badge colors and typical progress ranges.'
      }
    }
  }
};