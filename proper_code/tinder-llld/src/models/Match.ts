import { v4 as uuidv4 } from 'uuid';
import { IMatch } from '../interfaces';

export class Match implements IMatch {
  public id: string;
  public user1Id: string;
  public user2Id: string;
  public timestamp: Date;
  public isActive: boolean;

  constructor(user1Id: string, user2Id: string) {
    this.id = uuidv4();
    this.user1Id = user1Id;
    this.user2Id = user2Id;
    this.timestamp = new Date();
    this.isActive = true;
  }

  /**
   * Deactivate the match
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * Reactivate the match
   */
  reactivate(): void {
    this.isActive = true;
  }

  /**
   * Check if user is part of this match
   * @param userId User ID to check
   * @returns True if user is part of the match
   */
  includesUser(userId: string): boolean {
    return this.user1Id === userId || this.user2Id === userId;
  }

  /**
   * Get the other user's ID in the match
   * @param userId Current user's ID
   * @returns The other user's ID
   */
  getOtherUserId(userId: string): string | null {
    if (this.user1Id === userId) {
      return this.user2Id;
    } else if (this.user2Id === userId) {
      return this.user1Id;
    }
    return null;
  }

  /**
   * Get match summary
   * @returns Formatted match string
   */
  getMatchSummary(): string {
    return `Match ${this.id}: ${this.user1Id} <-> ${this.user2Id} (${this.isActive ? 'Active' : 'Inactive'})`;
  }
} 