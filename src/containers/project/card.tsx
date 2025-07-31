import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import CustomPercentage from '@/components/customPercentage';
import { Project, ProjectStatus } from '@/models/project';

interface ProjectCardProps {
  project: Project;
}

export const projectStatusVariants: Record<ProjectStatus, BadgeVariant> = {
  [ProjectStatus.ACTIVE]: 'info',
  [ProjectStatus.PLANNING]: 'warning',
  [ProjectStatus.ON_HOLD]: 'warning',
  [ProjectStatus.COMPLETED]: 'success',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { t } = useTranslation();
  const { title, status, taskCount, progress, lastUpdated } = project;

  return (
    <Card className="group hover:bg-primary/1 hover:border-primary cursor-pointer transition ease-in-out">
      <CardContent className="">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="group-hover:text-primary line-clamp-1 text-lg font-semibold text-gray-700 transition ease-in-out">
            {title}
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

          <p className="text-xs text-gray-500">
            {t('COMPONENTS.PROJECT_CARD.LAST_UPDATED')}: {lastUpdated}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
