import type { Meta, StoryObj } from '@storybook/react';
import Typography, { GroupedTypography } from './index';

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible typography component supporting all heading levels and text elements with consistent styling and semantic HTML structure.'
      }
    }
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'span'],
      description: 'HTML element to render'
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style variant'
    },
    children: {
      control: 'text',
      description: 'Text content to display'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Typography>;

// Heading Examples
export const Heading1: Story = {
  args: {
    as: 'h1',
    children: 'Main Project Title',
  },
};

export const Heading2: Story = {
  args: {
    as: 'h2',
    children: 'Section Heading',
  },
};

export const Heading3: Story = {
  args: {
    as: 'h3',
    children: 'Subsection Title',
  },
};

export const Heading4: Story = {
  args: {
    as: 'h4',
    children: 'Component Title',
  },
};

// Text Examples
export const Paragraph: Story = {
  args: {
    as: 'p',
    children: 'This is a paragraph of body text explaining project details and providing context for construction tasks.',
  },
};

export const Span: Story = {
  args: {
    as: 'span',
    children: 'Small helper text or inline content',
  },
};

// All Typography Variants
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Typography as="h1">H1 - Main Project Title</Typography>
      <Typography as="h2">H2 - Section Heading</Typography>
      <Typography as="h3">H3 - Subsection Title</Typography>
      <Typography as="h4">H4 - Component Title</Typography>
      <Typography as="p">
        Paragraph - This is body text used for descriptions, project details, and general content throughout the application.
      </Typography>
      <Typography as="span">
        Span - Small helper text for labels, captions, and inline content.
      </Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All typography variants showing the visual hierarchy from headings to body text.'
      }
    }
  }
};

// Construction-specific examples
export const ConstructionExamples: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Typography as="h1">Office Building Renovation</Typography>
        <Typography as="p" className="mt-2">
          A comprehensive renovation project for a 5-story office building in downtown, including electrical, plumbing, and HVAC upgrades.
        </Typography>
      </div>
      
      <div>
        <Typography as="h2">Floor Plan Details</Typography>
        <Typography as="p" className="mt-2">
          Ground floor layout includes reception area, conference rooms, and storage facilities.
        </Typography>
      </div>
      
      <div>
        <Typography as="h3">Task Information</Typography>
        <Typography as="h4" className="mt-2">Electrical Installation</Typography>
        <Typography as="p" className="mt-1">
          Install main electrical panel and distribute circuits to all rooms on the ground floor.
        </Typography>
        <Typography as="span" className="mt-2 block">
          Assigned to: John Smith • Due: Dec 15, 2024
        </Typography>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples from the construction task management system.'
      }
    }
  }
};

// Grouped Typography Component
const GroupedMeta: Meta<typeof GroupedTypography> = {
  title: 'Components/Typography',
  component: GroupedTypography,
};

export const GroupedBasic: StoryObj<typeof GroupedTypography> = {
  render: () => (
    <GroupedTypography 
      title={{ text: "Active Projects", as: "h3" }}
      subtext={{ text: "Currently in progress", as: "span" }}
    />
  ),
};

export const GroupedWithCount: StoryObj<typeof GroupedTypography> = {
  render: () => (
    <GroupedTypography 
      title={{ text: "Total Tasks", as: "h4" }}
      subtext={{ text: "Across all projects", as: "span" }}
      count={127}
    />
  ),
};

export const GroupedExamples: StoryObj<typeof GroupedTypography> = {
  render: () => (
    <div className="space-y-6">
      <GroupedTypography 
        title={{ text: "Project Statistics", as: "h2" }}
        subtext={{ text: "Overview of all construction projects", as: "p" }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GroupedTypography 
          title={{ text: "Completed Tasks", as: "h4" }}
          subtext={{ text: "This month", as: "span" }}
          count={89}
        />
        
        <GroupedTypography 
          title={{ text: "Active Projects", as: "h4" }}
          subtext={{ text: "In progress", as: "span" }}
          count={12}
        />
        
        <GroupedTypography 
          title={{ text: "Team Members", as: "h4" }}
          subtext={{ text: "Currently assigned", as: "span" }}
          count={45}
        />
      </div>
      
      <GroupedTypography 
        title={{ text: "Ground Floor", as: "h3" }}
        subtext={{ text: "Main building level with 8 rooms and 24 active tasks", as: "span" }}
        count={24}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grouped typography component showing title-subtitle combinations with optional count badges, commonly used for statistics and section headers.'
      }
    }
  }
};

// Custom Styling
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography as="h2" className="text-blue-600">
        Custom Blue Heading
      </Typography>
      
      <Typography as="p" className="text-green-700 font-semibold">
        Success message with custom styling
      </Typography>
      
      <Typography as="span" className="text-red-500 text-xs uppercase tracking-wide">
        Error label
      </Typography>
      
      <Typography 
        as="h3" 
        className="bg-gray-100 p-4 rounded-md border-l-4 border-orange-400"
      >
        Warning: This section requires attention
      </Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of custom styling using the className prop to override default styles.'
      }
    }
  }
};