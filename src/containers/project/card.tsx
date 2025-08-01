import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import CustomPercentage from '@/components/customPercentage';
import { ProjectWithStats } from '@/database/schemas/project.schema';
import { ProjectStatus } from '@/database/schemas/base.schema';
import { useNavigate } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Eye, EllipsisVertical, Edit, Trash } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectWithStats;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const projectStatusVariants: Record<ProjectStatus, BadgeVariant> = {
  [ProjectStatus.ACTIVE]: 'info',
  [ProjectStatus.PLANNING]: 'warning',
  [ProjectStatus.ON_HOLD]: 'warning',
  [ProjectStatus.COMPLETED]: 'success',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, name, status, taskCount, progress, updated_at } = project;

  return (
    <Card
      onClick={() => navigate(`/project/${id}`)}
      className="group hover:bg-primary/1 hover:border-primary cursor-pointer transition ease-in-out">
      <CardContent className="relative">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="group-hover:text-primary line-clamp-1 text-lg font-semibold text-gray-700 transition ease-in-out">
            {name}
          </h3>
          <Badge variant={projectStatusVariants[status]}>
            {t(`ATTRIBUTES.PROJECT.STATUS_ENUM.${status.toUpperCase()}`)}
          </Badge>
        </div>

        <div className="flex flex-col gap-y-4">
          <p className="text-sm text-gray-600">
            {taskCount} {t('COMPONENTS.PROJECT_CARD.TASKS')}
          </p>

          <div className="flex flex-col gap-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {t('COMPONENTS.PROJECT_CARD.PROGRESS')}
              </span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>
            {/* <Progress value={progress} className="h-2" /> */}
            <CustomPercentage percentage={progress} />
          </div>

          <div className="flex flex-row items-center justify-between">
            <p className="text-xs text-gray-500">
              {t('COMPONENTS.PROJECT_CARD.LAST_UPDATED')}:{' '}
              {formatDistanceToNow(new Date(updated_at), { addSuffix: true })}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger className="!px-0 focus:ring-0">
                <EllipsisVertical className="text-gray-400" size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">
                  {t('HELPERS.ACTIONS.ACTIONS')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex flex-row gap-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(id);
                  }}>
                  <Edit size={12} />
                  {t('HELPERS.ACTIONS.EDIT')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex flex-row gap-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(id);
                  }}>
                  <Trash className="text-red-600" size={12} />
                  {t('HELPERS.ACTIONS.DELETE')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <Card className="cursor-pointer">
      <CardContent className="">
        <div className="mb-4 flex items-start justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-16" />
        </div>

        <div className="flex flex-col gap-y-4">
          <Skeleton className="h-4 w-20" />

          <div className="flex flex-col gap-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>

          <Skeleton className="h-3 w-32" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
