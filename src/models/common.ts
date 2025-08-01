import { ReactNode } from 'react';

export interface RouteProps {
  path: string;
  protected: boolean;
  element: ReactNode;
}

export enum EntityActions {
  EDIT = 'edit',
  VIEW = 'view',
  ADD = 'add',
  DELETE = 'delete',
}
