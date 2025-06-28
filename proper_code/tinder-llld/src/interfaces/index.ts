export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IUserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  photos: string[];
  bio: string;
  location: ILocation;
  preferredRadius: number; // in kilometers
  preferredAgeRange: {
    min: number;
    max: number;
  };
  preferredGender: 'male' | 'female' | 'other' | 'all';
}

export interface IMatch {
  id: string;
  user1Id: string;
  user2Id: string;
  timestamp: Date;
  isActive: boolean;
  deactivate(): void;
  reactivate(): void;
  includesUser(userId: string): boolean;
  getOtherUserId(userId: string): string | null;
  getMatchSummary(): string;
}

export interface IMessage {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  markAsRead(): void;
  markAsUnread(): void;
  isSentBy(userId: string): boolean;
  isReceivedBy(userId: string): boolean;
  getMessageSummary(): string;
}

export interface INotification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'like';
  content: string;
  timestamp: Date;
  isRead: boolean;
  relatedId?: string; // matchId or messageId
  markAsRead(): void;
  markAsUnread(): void;
  getNotificationSummary(): string;
  isOfType(type: 'match' | 'message' | 'like'): boolean;
}

export interface ISwipeAction {
  swiperId: string;
  swipedUserId: string;
  action: 'like' | 'pass';
  timestamp: Date;
}

export interface IObserver {
  update(notification: INotification): void;
}

export interface INotificationService {
  subscribe(userId: string, observer: IObserver): void;
  unsubscribe(userId: string, observer: IObserver): void;
  notify(userId: string, notification: INotification): void;
}

export interface IMatchingStrategy {
  findMatches(user: IUserProfile, allUsers: IUserProfile[]): IUserProfile[];
}

export interface ILocationService {
  calculateDistance(location1: ILocation, location2: ILocation): number;
  isWithinRadius(location1: ILocation, location2: ILocation, radiusKm: number): boolean;
} 