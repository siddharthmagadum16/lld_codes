import { IMessage } from '../interfaces';
import { Message } from '../models/Message';
import { MatchingService } from './MatchingService';
import { NotificationService } from './NotificationService';
import { ProfileService } from './ProfileService';

export class MessagingService {
  private messages: Map<string, IMessage[]> = new Map(); // matchId -> messages
  private matchingService: MatchingService;
  private notificationService: NotificationService;
  private profileService: ProfileService;

  constructor(
    matchingService: MatchingService,
    notificationService: NotificationService,
    profileService: ProfileService
  ) {
    this.matchingService = matchingService;
    this.notificationService = notificationService;
    this.profileService = profileService;
  }

  /**
   * Send a message between matched users
   * @param senderId Sender user ID
   * @param receiverId Receiver user ID
   * @param content Message content
   * @returns Sent message or null if users aren't matched
   */
  sendMessage(senderId: string, receiverId: string, content: string): IMessage | null {
    // Check if users are matched
    if (!this.matchingService.areUsersMatched(senderId, receiverId)) {
      throw new Error('Users are not matched. Cannot send message.');
    }

    // Find the match
    const senderMatches = this.matchingService.getUserMatches(senderId);
    const match = senderMatches.find(m => 
      m.user1Id === receiverId || m.user2Id === receiverId
    );

    if (!match) {
      return null;
    }

    // Create message
    const message = new Message(match.id, senderId, receiverId, content);

    // Store message
    if (!this.messages.has(match.id)) {
      this.messages.set(match.id, []);
    }
    this.messages.get(match.id)!.push(message);

    // Send notification to receiver
    const senderProfile = this.profileService.getProfile(senderId);
    if (senderProfile) {
      this.notificationService.createNotification(
        receiverId,
        'message',
        `New message from ${senderProfile.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
        message.id
      );
    }

    return message;
  }

  /**
   * Get all messages for a match
   * @param matchId Match ID
   * @param userId User requesting messages (for authorization)
   * @returns Array of messages in chronological order
   */
  getMatchMessages(matchId: string, userId: string): IMessage[] {
    // Verify user is part of the match
    const match = this.matchingService.getMatch(matchId);
    if (!match || !match.includesUser(userId)) {
      return [];
    }

    const messages = this.messages.get(matchId) || [];
    return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get all conversations for a user
   * @param userId User ID
   * @returns Array of match IDs with their latest messages
   */
  getUserConversations(userId: string): Array<{
    matchId: string;
    otherUserId: string;
    otherUserName: string;
    lastMessage?: IMessage;
    unreadCount: number;
  }> {
    const userMatches = this.matchingService.getUserMatches(userId);
    const conversations: Array<{
      matchId: string;
      otherUserId: string;
      otherUserName: string;
      lastMessage?: IMessage;
      unreadCount: number;
    }> = [];

    for (const match of userMatches) {
      const otherUserId = match.getOtherUserId(userId);
      if (!otherUserId) continue;

      const otherUserProfile = this.profileService.getProfile(otherUserId);
      if (!otherUserProfile) continue;

      const matchMessages = this.messages.get(match.id) || [];
      const lastMessage = matchMessages.length > 0 
        ? matchMessages[matchMessages.length - 1] 
        : undefined;

      const unreadCount = matchMessages.filter(
        msg => msg.receiverId === userId && !msg.isRead
      ).length;

      conversations.push({
        matchId: match.id,
        otherUserId,
        otherUserName: otherUserProfile.name,
        lastMessage,
        unreadCount
      });
    }

    // Sort by last message timestamp (most recent first)
    return conversations.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp.getTime() || 0;
      const bTime = b.lastMessage?.timestamp.getTime() || 0;
      return bTime - aTime;
    });
  }

  /**
   * Mark messages as read
   * @param matchId Match ID
   * @param userId User marking messages as read
   * @returns Number of messages marked as read
   */
  markMessagesAsRead(matchId: string, userId: string): number {
    // Verify user is part of the match
    const match = this.matchingService.getMatch(matchId);
    if (!match || !match.includesUser(userId)) {
      return 0;
    }

    const messages = this.messages.get(matchId) || [];
    let markedCount = 0;

    messages.forEach(message => {
      if (message.receiverId === userId && !message.isRead) {
        message.markAsRead();
        markedCount++;
      }
    });

    return markedCount;
  }

  /**
   * Get unread message count for a user
   * @param userId User ID
   * @returns Total number of unread messages
   */
  getUnreadMessageCount(userId: string): number {
    const userMatches = this.matchingService.getUserMatches(userId);
    let unreadCount = 0;

    for (const match of userMatches) {
      const matchMessages = this.messages.get(match.id) || [];
      unreadCount += matchMessages.filter(
        msg => msg.receiverId === userId && !msg.isRead
      ).length;
    }

    return unreadCount;
  }

  /**
   * Delete a message (only sender can delete)
   * @param messageId Message ID
   * @param userId User requesting deletion
   * @returns True if deleted, false otherwise
   */
  deleteMessage(messageId: string, userId: string): boolean {
    for (const [matchId, messages] of this.messages.entries()) {
      const messageIndex = messages.findIndex(
        msg => msg.id === messageId && msg.senderId === userId
      );
      
      if (messageIndex !== -1) {
        messages.splice(messageIndex, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Search messages by content
   * @param userId User ID
   * @param query Search query
   * @returns Array of matching messages
   */
  searchMessages(userId: string, query: string): IMessage[] {
    const userMatches = this.matchingService.getUserMatches(userId);
    const results: IMessage[] = [];
    const lowercaseQuery = query.toLowerCase();

    for (const match of userMatches) {
      const matchMessages = this.messages.get(match.id) || [];
      const matchingMessages = matchMessages.filter(msg =>
        msg.content.toLowerCase().includes(lowercaseQuery)
      );
      results.push(...matchingMessages);
    }

    return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get message by ID
   * @param messageId Message ID
   * @param userId User requesting the message
   * @returns Message or null if not found or unauthorized
   */
  getMessage(messageId: string, userId: string): IMessage | null {
    for (const messages of this.messages.values()) {
      const message = messages.find(msg => msg.id === messageId);
      if (message && (message.senderId === userId || message.receiverId === userId)) {
        return message;
      }
    }
    return null;
  }

  /**
   * Get total message count
   * @returns Total number of messages in the system
   */
  getTotalMessageCount(): number {
    let total = 0;
    for (const messages of this.messages.values()) {
      total += messages.length;
    }
    return total;
  }

  /**
   * Get messages sent by a specific user
   * @param userId User ID
   * @returns Array of messages sent by the user
   */
  getMessagesSentByUser(userId: string): IMessage[] {
    const sentMessages: IMessage[] = [];
    
    for (const messages of this.messages.values()) {
      const userMessages = messages.filter(msg => msg.senderId === userId);
      sentMessages.push(...userMessages);
    }
    
    return sentMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
} 