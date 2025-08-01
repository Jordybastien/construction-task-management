import { ErrorCode, HttpStatus, ERROR_HTTP_STATUS_MAP } from './constants';

export interface DatabaseErrorDetails {
  code: ErrorCode;
  message: string;
  httpStatus: HttpStatus;
  context?: Record<string, any>;
  originalError?: Error;
}

export class DatabaseError extends Error {
  public readonly code: ErrorCode;
  public readonly httpStatus: HttpStatus;
  public readonly context?: Record<string, any>;
  public readonly originalError?: Error;

  constructor(details: Omit<DatabaseErrorDetails, 'httpStatus'>) {
    super(details.message);
    this.name = 'DatabaseError';
    this.code = details.code;
    this.httpStatus = ERROR_HTTP_STATUS_MAP[details.code];
    this.context = details.context;
    this.originalError = details.originalError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }

  static userNotFound(userId?: string): DatabaseError {
    return new DatabaseError({
      code: ErrorCode.USER_NOT_FOUND,
      message: 'User not found',
      context: { userId }
    });
  }

  static userAlreadyExists(name: string): DatabaseError {
    return new DatabaseError({
      code: ErrorCode.USER_ALREADY_EXISTS,
      message: 'User with this name already exists',
      context: { name }
    });
  }

  static projectNotFound(projectId?: string): DatabaseError {
    return new DatabaseError({
      code: ErrorCode.PROJECT_NOT_FOUND,
      message: 'Project not found',
      context: { projectId }
    });
  }

  static projectAccessDenied(projectId: string, userId: string): DatabaseError {
    return new DatabaseError({
      code: ErrorCode.PROJECT_ACCESS_DENIED,
      message: 'Access denied to project',
      context: { projectId, userId }
    });
  }

  static taskNotFound(taskId?: string): DatabaseError {
    return new DatabaseError({
      code: ErrorCode.TASK_NOT_FOUND,
      message: 'Task not found',
      context: { taskId }
    });
  }

  static checklistItemNotFound(itemId?: string): DatabaseError {
    return new DatabaseError({
      code: ErrorCode.CHECKLIST_ITEM_NOT_FOUND,
      message: 'Checklist item not found',
      context: { itemId }
    });
  }

  static invalidInput(field: string, value?: any): DatabaseError {
    return new DatabaseError({
      code: ErrorCode.INVALID_INPUT,
      message: `Invalid input for field: ${field}`,
      context: { field, value }
    });
  }

  static databaseError(operation: string, originalError?: Error): DatabaseError {
    return new DatabaseError({
      code: ErrorCode.DATABASE_ERROR,
      message: `Database operation failed: ${operation}`,
      context: { operation },
      originalError
    });
  }

  static validationError(field: string, reason: string): DatabaseError {
    return new DatabaseError({
      code: ErrorCode.VALIDATION_ERROR,
      message: `Validation failed for ${field}: ${reason}`,
      context: { field, reason }
    });
  }

  toJSON(): DatabaseErrorDetails {
    return {
      code: this.code,
      message: this.message,
      httpStatus: this.httpStatus,
      context: this.context,
      originalError: this.originalError
    };
  }
}