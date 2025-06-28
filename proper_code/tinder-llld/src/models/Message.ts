import { v4 as uuidv4 } from 'uuid';
import { IMessage } from '../interfaces';

export class Message implements IMessage {
  public id: string;
  public matchId: string;
  public senderId: string;
  public receiverId: string;
  public content: string;
  public timestamp: Date;
  public isRead: boolean;

  constructor(
    matchId: string,
    senderId: string,
    receiverId: string,
    content: string
  ) {
    this.id = uuidv4();
    this.matchId = matchId;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.timestamp = new Date();
    this.isRead = false;
  }

  /**
   * Mark message as read
   */
  markAsRead(): void {
    this.isRead = true;
  }

  /**
   * Mark message as unread
   */
  markAsUnread(): void {
    this.isRead = false;
  }

  /**
   * Check if message was sent by specific user
   * @param userId User ID to check
   * @returns True if user sent this message
   */
  isSentBy(userId: string): boolean {
    return this.senderId === userId;
  }

  /**
   * Check if message was received by specific user
   * @param userId User ID to check
   * @returns True if user received this message
   */
  isReceivedBy(userId: string): boolean {
    return this.receiverId === userId;
  }

  /**
   * Get message summary
   * @returns Formatted message string
   */
  getMessageSummary(): string {
    const status = this.isRead ? 'Read' : 'Unread';
    return `[${status}] ${this.senderId} -> ${this.receiverId}: ${this.content.substring(0, 50)}${this.content.length > 50 ? '...' : ''}`;
  }
} 