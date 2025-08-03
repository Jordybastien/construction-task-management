import { v4 as uuidv4 } from 'uuid';
import type { Database } from '../index';
import { DatabaseError } from '../errors/databaseErrors';

export abstract class BaseService {
  protected db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  protected generateId(): string {
    return uuidv4();
  }

  protected getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  protected createAuditTrail() {
    const now = this.getCurrentTimestamp();
    return {
      created_at: now,
      updated_at: now
    };
  }

  protected updateAuditTrail() {
    return {
      updated_at: this.getCurrentTimestamp()
    };
  }

  protected handleError(error: any, operation: string): never {
    console.error(`Database error in ${operation}:`, error);
    
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    throw DatabaseError.databaseError(operation, error);
  }
}