import { create } from 'zustand';
import type { ProjectWithStats } from '@/database/schemas/project.schema';

interface ProjectState {
  projects: ProjectWithStats[];
  lastFetched: number | null;
}

interface ProjectActions {
  setProjects: (projects: ProjectWithStats[]) => void;
  addProject: (project: ProjectWithStats) => void;
  updateProject: (id: string, updates: Partial<ProjectWithStats>) => void;
  deleteProject: (id: string) => void;
  clearProjects: () => void;
}

const initialState: ProjectState = {
  projects: [],
  lastFetched: null,
};

const useProjectStore = create<ProjectState & ProjectActions>()((set) => ({
  ...initialState,

  setProjects: (projects: ProjectWithStats[]) => {
    set({
      projects,
      lastFetched: Date.now(),
    });
  },

  addProject: (project: ProjectWithStats) => {
    set((state) => ({
      projects: [...state.projects, project],
    }));
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      ),
    }));
  },

  deleteProject: (id: string) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    }));
  },

  clearProjects: () => {
    set(initialState);
  },
}));

export const useProjects = () => useProjectStore((state) => state.projects);
export const useSetProjects = () =>
  useProjectStore((state) => state.setProjects);
export const useAddProject = () => useProjectStore((state) => state.addProject);
export const useUpdateProject = () =>
  useProjectStore((state) => state.updateProject);
export const useDeleteProject = () =>
  useProjectStore((state) => state.deleteProject);
export const useClearProjects = () =>
  useProjectStore((state) => state.clearProjects);
