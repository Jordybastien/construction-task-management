import { replicateRxCollection } from 'rxdb/plugins/replication';
import type { Database } from '../index';
import { REPLICATION_IDENTIFIERS, REPLICATION_CONFIG } from './constants';
import api from '@/services/api';
import { buildQueryString } from '@/utils/common';

const createReplicationHandler = (
  endpoint: string,
  customParams?: Record<string, any>
) => ({
  push: {
    handler: async (docs: any[]) => {
      const response = await api.post(`/sync${endpoint}/push`, docs);
      return response.data;
    },
  },
  pull: {
    handler: async (lastCheckpoint: any, batchSize: number = 100) => {
      const queryParams = {
        limit: batchSize,
        checkpoint: lastCheckpoint ? JSON.stringify(lastCheckpoint) : '',
        ...customParams,
      };

      const response = await api.get(
        `/sync${endpoint}/pull?${buildQueryString(queryParams)}`
      );
      return response.data;
    },
  },
});

export const setupReplication = (database: Database) => {
  const userHandler = createReplicationHandler('/users', {
    expand: 'profile',
  });
  const userReplication = replicateRxCollection({
    collection: database.users,
    replicationIdentifier: REPLICATION_IDENTIFIERS.USERS,
    ...REPLICATION_CONFIG,
    push: userHandler.push,
    pull: userHandler.pull,
  });

  const projectHandler = createReplicationHandler('/projects', {
    // custom query params here
  });

  const projectReplication = replicateRxCollection({
    collection: database.projects,
    replicationIdentifier: REPLICATION_IDENTIFIERS.PROJECTS,
    ...REPLICATION_CONFIG,
    push: projectHandler.push,
    pull: projectHandler.pull,
  });

  const taskHandler = createReplicationHandler('/tasks', {
    // custom query params here
  });
  const taskReplication = replicateRxCollection({
    collection: database.tasks,
    replicationIdentifier: REPLICATION_IDENTIFIERS.TASKS,
    ...REPLICATION_CONFIG,
    push: taskHandler.push,
    pull: taskHandler.pull,
  });

  return {
    userReplication,
    projectReplication,
    taskReplication,
    start: () => {
      userReplication.start();
      projectReplication.start();
      taskReplication.start();
    },
    stop: () => {
      userReplication.cancel();
      projectReplication.cancel();
      taskReplication.cancel();
    },
  };
};
