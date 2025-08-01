import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import ProjectCard, { ProjectCardSkeleton } from '@/containers/project/card';
import CreateProjectCard from '@/containers/project/createCard';
import AddOrEditProjectModal from '@/containers/project/addOrEditProjectModal';
import DeleteProjectModal from '@/containers/project/deleteProjectModal';
import useProjects from '@/hooks/projects/useFetchAll';
import { useCurrentUser } from '@/stores/auth.store';
import EmptyIllustration from '@/components/emptyIllustration';
import { isEmpty } from 'lodash';
import { useSearchParams } from 'react-router';
import { EntityActions } from '@/models/common';

const ProjectGrid: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = useCurrentUser();
  const { projects, isLoading } = useProjects(currentUser?.id);

  const action = useMemo(
    () => searchParams.get('action') as EntityActions | null,
    [searchParams]
  );

  const projectId = useMemo(
    () => searchParams.get('projectId'),
    [searchParams]
  );

  const isModalVisible = useCallback(
    (entityAction: EntityActions) => {
      if (entityAction === EntityActions.ADD) {
        return action === EntityActions.ADD;
      }
      return entityAction === action && !!projectId;
    },
    [action, projectId]
  );

  const selectedProject = useMemo(
    () =>
      projectId ? projects?.find((p) => p.id === projectId) || null : null,
    [projects, projectId]
  );

  const handleSearch = (evt: React.MouseEvent) => {
    evt.preventDefault();
    setSearchTerm(searchQuery);
  };

  const openModal = useCallback(
    (entityAction: EntityActions, projectId: string | null = null) => {
      const params: Record<string, string> = { action: entityAction };
      if (projectId) {
        params.projectId = projectId;
      }
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const closeModal = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <div className="space-y-6">
      {!isEmpty(projects) && (
        <div className="flex flex-col gap-4 sm:flex-row">
          <form className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder={t('PAGES.HOME.SEARCH.PLACEHOLDER')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pr-10 pl-10"
            />
            {searchQuery && (
              <Button
                size="sm"
                onClick={handleSearch}
                type="submit"
                className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform p-0 hover:bg-gray-100">
                <Search size={10} />
              </Button>
            )}
          </form>
          <Button
            onClick={() => openModal(EntityActions.ADD)}
            className="flex items-center gap-2"
            disabled={isLoading}>
            <Plus className="h-4 w-4" />
            {t('PAGES.HOME.ACTIONS.CREATE_PROJECT')}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <ProjectCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            <>
              {isEmpty(projects) ? (
                <div className="col-span-3 flex w-full flex-col items-center justify-center gap-y-4 py-12">
                  <EmptyIllustration
                    message={t('PAGES.HOME.EMPTY_STATE.NO_PROJECTS')}
                  />
                  <Button
                    onClick={() => openModal(EntityActions.ADD)}
                    className="flex items-center gap-2"
                    disabled={isLoading}>
                    <Plus className="h-4 w-4" />
                    {t('PAGES.HOME.ACTIONS.CREATE_PROJECT')}
                  </Button>
                </div>
              ) : (
                <>
                  {projects?.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={(id) => openModal(EntityActions.EDIT, id)}
                      onDelete={(id) => openModal(EntityActions.DELETE, id)}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
        {!isEmpty(projects) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CreateProjectCard
              onAddProject={() => openModal(EntityActions.ADD)}
            />
          </div>
        )}
      </div>

      <AddOrEditProjectModal
        isOpen={
          isModalVisible(EntityActions.ADD) ||
          isModalVisible(EntityActions.EDIT)
        }
        onClose={closeModal}
        project={selectedProject}
      />

      <DeleteProjectModal
        isOpen={isModalVisible(EntityActions.DELETE)}
        onClose={closeModal}
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectGrid;
