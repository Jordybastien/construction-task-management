import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import ProjectCard from '@/containers/project/card';
import CreateProjectCard from '@/containers/project/createCard';
import { Project, ProjectStatus } from '@/models/project';

const ProjectGrid: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateCard, setShowCreateCard] = useState(false);

  // TODO: Get this data from hook
  const projects: Project[] = [
    {
      id: 1,
      title: 'Downtown Office Complex',
      status: ProjectStatus.ACTIVE,
      taskCount: 45,
      progress: 65,
      lastUpdated: '2 days ago',
    },
    {
      id: 2,
      title: 'Residential Towers Phase 2',
      status: ProjectStatus.ACTIVE,
      taskCount: 32,
      progress: 40,
      lastUpdated: '1 day ago',
    },
    {
      id: 3,
      title: 'School Building Upgrade',
      status: ProjectStatus.ACTIVE,
      taskCount: 18,
      progress: 85,
      lastUpdated: '3 days ago',
    },
    {
      id: 4,
      title: 'Hospital Extension',
      status: ProjectStatus.PLANNING,
      taskCount: 8,
      progress: 15,
      lastUpdated: '1 week ago',
    },
    {
      id: 5,
      title: 'Shopping Mall Renovation',
      status: ProjectStatus.ON_HOLD,
      taskCount: 28,
      progress: 75,
      lastUpdated: '4 days ago',
    },
    {
      id: 6,
      title: 'Bridge Construction',
      status: ProjectStatus.COMPLETED,
      taskCount: 156,
      progress: 100,
      lastUpdated: '2 weeks ago',
    },
  ];

  const handleSearch = (evt: React.MouseEvent) => {
    evt.preventDefault();
    setSearchTerm(searchQuery);
  };

  return (
    <div className="space-y-6">
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
          onClick={() => setShowCreateCard(!showCreateCard)}
          className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('PAGES.HOME.ACTIONS.CREATE_PROJECT')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <CreateProjectCard />
      </div>
    </div>
  );
};

export default ProjectGrid;
