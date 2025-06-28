import { v4 as uuidv4 } from 'uuid';
import { INotification } from '../interfaces';

export class Notification implements INotification {
  public id: string;
  public userId: string;
  public type: 'match' | 'message' | 'like';
  public content: string;
  public timestamp: Date;
  public isRead: boolean;
  public relatedId?: string;

  constructor(
    userId: string,
    type: 'match' | 'message' | 'like',
    content: string,
    relatedId?: string
  ) {
    this.id = uuidv4();
    this.userId = userId;
    this.type = type;
    this.content = content;
    this.timestamp = new Date();
    this.isRead = false;
    this.relatedId = relatedId;
  }

  /**
   * Mark notification as read
   */
  markAsRead(): void {
    this.isRead = true;
  }

  /**
   * Mark notification as unread
   */
  markAsUnread(): void {
    this.isRead = false;
  }

  /**
   * Get notification summary
   * @returns Formatted notification string
   */
  getNotificationSummary(): string {
    const status = this.isRead ? 'Read' : 'Unread';
    const typeEmoji = this.getTypeEmoji();
    return `[${status}] ${typeEmoji} ${this.content}`;
  }

  /**
   * Get emoji for notification type
   * @returns Emoji representing the notification type
   */
  private getTypeEmoji(): string {
    switch (this.type) {
      case 'match':
        return '💕';
      case 'message':
        return '💬';
      case 'like':
        return '❤️';
      default:
        return '📱';
    }
  }

  /**
   * Check if notification is of specific type
   * @param type Notification type to check
   * @returns True if notification matches the type
   */
  isOfType(type: 'match' | 'message' | 'like'): boolean {
    return this.type === type;
  }
} 