import { create } from 'zustand';
import type { ProjectWithStats } from '@/database/schemas/project.schema';

interface ProjectState {
  projects: ProjectWithStats[];
  selectedProject: ProjectWithStats | null;
  lastFetched: number | null;
}

interface ProjectActions {
  setProjects: (projects: ProjectWithStats[]) => void;
  setSelectedProject: (project: ProjectWithStats | null) => void;
  addProject: (project: ProjectWithStats) => void;
  updateProject: (id: string, updates: Partial<ProjectWithStats>) => void;
  deleteProject: (id: string) => void;
  clearProjects: () => void;
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
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

  setSelectedProject: (project: ProjectWithStats | null) => {
    set({ selectedProject: project });
  },

  addProject: (project: ProjectWithStats) => {
    set((state) => ({
      projects: [...state.projects, project],
    }));
  },

  updateProject: (id: string, updates: Partial<ProjectWithStats>) => {
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
export const useSelectedProject = () => useProjectStore((state) => state.selectedProject);
export const useSetProjects = () =>
  useProjectStore((state) => state.setProjects);
export const useSetSelectedProject = () =>
  useProjectStore((state) => state.setSelectedProject);
export const useAddProject = () => useProjectStore((state) => state.addProject);
export const useUpdateProject = () =>
  useProjectStore((state) => state.updateProject);
export const useDeleteProject = () =>
  useProjectStore((state) => state.deleteProject);
export const useClearProjects = () =>
  useProjectStore((state) => state.clearProjects);
