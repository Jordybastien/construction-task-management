import { closeDatabase } from './index';

class DatabaseManager {
  private currentUserId: string | null = null;

  /**
   * Generates a consistent user ID from a name
   * @param name - The user's name
   * @returns Formatted user ID
   */
  static generateUserId(name: string): string {
    return `user_${name.toLowerCase().replace(/\s+/g, '_')}`;
  }

  /**
   * Switches to a user by name, closing the current database if needed
   * @param name - The user's name
   */
  async switchUserByName(name: string): Promise<void> {
    const userId = DatabaseManager.generateUserId(name);
    await this.switchUser(userId);
  }

  /**
   * Switches to a different user, closing the current database if needed
   * @param userId - The new user ID to switch to
   */
  async switchUser(userId: string): Promise<void> {
    if (this.currentUserId === userId) {
      return;
    }

    if (this.currentUserId && this.currentUserId !== userId) {
      await this.close();
    }

    this.currentUserId = userId;
  }

  /**
   * Closes the current database and cleans up resources
   * Should be called when user logs out or application is shutting down
   */
  async close(): Promise<void> {
    if (this.currentUserId) {
      await closeDatabase();
      this.currentUserId = null;
    }
  }

  /**
   * Gets the current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  /**
   * Checks if a database is currently initialized
   */
  isInitialized(): boolean {
    return this.currentUserId !== null;
  }
}

// Global singleton instance
export const databaseManager = new DatabaseManager();
export default databaseManager;
