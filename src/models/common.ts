import { ReactNode } from 'react';

export interface RouteProps {
  path: string;
  protected: boolean;
  element: ReactNode;
}
