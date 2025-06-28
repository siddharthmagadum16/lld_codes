import { INotification, IObserver, INotificationService } from '../interfaces';
import { Notification } from '../models/Notification';

export class NotificationService implements INotificationService {
  private observers: Map<string, IObserver[]> = new Map();
  private notifications: Map<string, INotification[]> = new Map();

  /**
   * Subscribe an observer to notifications for a specific user
   * @param userId User ID to subscribe for
   * @param observer Observer to add
   */
  subscribe(userId: string, observer: IObserver): void {
    if (!this.observers.has(userId)) {
      this.observers.set(userId, []);
    }
    this.observers.get(userId)!.push(observer);
  }

  /**
   * Unsubscribe an observer from notifications for a specific user
   * @param userId User ID to unsubscribe from
   * @param observer Observer to remove
   */
  unsubscribe(userId: string, observer: IObserver): void {
    const userObservers = this.observers.get(userId);
    if (userObservers) {
      const index = userObservers.indexOf(observer);
      if (index > -1) {
        userObservers.splice(index, 1);
      }
    }
  }

  /**
   * Notify all observers for a specific user
   * @param userId User ID to notify
   * @param notification Notification to send
   */
  notify(userId: string, notification: INotification): void {
    // Store notification
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId)!.push(notification);

    // Notify observers
    const userObservers = this.observers.get(userId);
    if (userObservers) {
      userObservers.forEach(observer => observer.update(notification));
    }
  }

  /**
   * Create and send a notification
   * @param userId User ID to notify
   * @param type Notification type
   * @param content Notification content
   * @param relatedId Optional related ID
   */
  createNotification(
    userId: string,
    type: 'match' | 'message' | 'like',
    content: string,
    relatedId?: string
  ): void {
    const notification = new Notification(userId, type, content, relatedId);
    this.notify(userId, notification);
  }

  /**
   * Get all notifications for a user
   * @param userId User ID
   * @returns Array of notifications
   */
  getUserNotifications(userId: string): INotification[] {
    return this.notifications.get(userId) || [];
  }

  /**
   * Get unread notifications for a user
   * @param userId User ID
   * @returns Array of unread notifications
   */
  getUnreadNotifications(userId: string): INotification[] {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter(notification => !notification.isRead);
  }

  /**
   * Mark all notifications as read for a user
   * @param userId User ID
   */
  markAllAsRead(userId: string): void {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.forEach(notification => notification.markAsRead());
  }

  /**
   * Mark specific notification as read
   * @param userId User ID
   * @param notificationId Notification ID
   */
  markAsRead(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.markAsRead();
    }
  }
}