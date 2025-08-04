import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { MoreHorizontal, MapPin, Users, Calendar } from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component with header, content, and footer sections. Designed with container queries for responsive layouts.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
        <CardDescription>This is a basic card example with minimal content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>This card has an action button in the header.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Content area with action button in the header.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
        <CardDescription>This card includes a footer section.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

// Construction-specific examples
export const ProjectCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Office Building Renovation</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Downtown District
          </div>
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">68%</span>
          </div>
          <Progress value={68} />
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              5 Members
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Due Dec 15
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Badge variant="secondary">In Progress</Badge>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A project card showing construction project details with progress, team info, and status.'
      }
    }
  }
};

export const TaskCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Electrical Installation</CardTitle>
        <CardDescription>Install main electrical panel in basement</CardDescription>
        <CardAction>
          <Badge variant="outline">High Priority</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Checklist Items</span>
            <span className="text-muted-foreground">3 of 5 completed</span>
          </div>
          <Progress value={60} />
          
          <div className="text-sm text-muted-foreground">
            Assigned to: John Smith
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary" className="mr-2">
          View Details
        </Button>
        <Button size="sm">
          Mark Complete
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A task card displaying construction task information with progress tracking and action buttons.'
      }
    }
  }
};

export const FloorPlanCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Ground Floor</CardTitle>
        <CardDescription>Main building level with offices and reception</CardDescription>
        <CardAction>
          <Button variant="tertiary" size="sm">
            View Plan
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="bg-muted rounded-lg h-32 flex items-center justify-center text-muted-foreground">
            Floor Plan Preview
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Rooms:</span> 8
            </div>
            <div>
              <span className="font-medium">Tasks:</span> 24
            </div>
            <div>
              <span className="font-medium">Area:</span> 1,200 sqm
            </div>
            <div>
              <span className="font-medium">Progress:</span> 45%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A floor plan card showing building level information with room count, task statistics, and area details.'
      }
    }
  }
};

export const CardVariations: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Minimal Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Just header and content</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With All Sections</CardTitle>
          <CardDescription>Complete card structure</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>Full card with all available sections</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Action</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different card configurations showing the flexibility of the component structure.'
      }
    }
  }
};