import { IUserProfile, ILocation, IObserver, INotification } from './interfaces';
import { ProfileService } from './services/ProfileService';
import { MatchingService } from './services/MatchingService';
import { MessagingService } from './services/MessagingService';
import { NotificationService } from './services/NotificationService';

// Observer implementation for users to receive real-time notifications
export class UserNotificationObserver implements IObserver {
  constructor(private userId: string, private userName: string) {}

  update(notification: INotification): void {
    console.log(`🔔 [${this.userName}] ${notification.getNotificationSummary()}`);
  }
}

// Singleton pattern for TinderApp
export class TinderApp {
  private static instance: TinderApp;
  private profileService: ProfileService;
  private notificationService: NotificationService;
  private matchingService: MatchingService;
  private messagingService: MessagingService;
  private userObservers: Map<string, UserNotificationObserver> = new Map();

  private constructor() {
    // Initialize services
    this.profileService = new ProfileService();
    this.notificationService = new NotificationService();
    this.matchingService = new MatchingService(this.profileService, this.notificationService);
    this.messagingService = new MessagingService(
      this.matchingService,
      this.notificationService,
      this.profileService
    );
  }

  /**
   * Get singleton instance of TinderApp
   * @returns TinderApp instance
   */
  public static getInstance(): TinderApp {
    if (!TinderApp.instance) {
      TinderApp.instance = new TinderApp();
    }
    return TinderApp.instance;
  }

  /**
   * Create a new user profile
   * @param name User name
   * @param age User age
   * @param gender User gender
   * @param photos Array of photo URLs
   * @param bio User bio
   * @param location User location
   * @param preferredRadius Preferred search radius
   * @param preferredAgeRange Preferred age range
   * @param preferredGender Preferred gender
   * @returns Created user profile
   */
  createProfile(
    name: string,
    age: number,
    gender: 'male' | 'female' | 'other',
    photos: string[],
    bio: string,
    location: ILocation,
    preferredRadius?: number,
    preferredAgeRange?: { min: number; max: number },
    preferredGender?: 'male' | 'female' | 'other' | 'all'
  ): IUserProfile {
    const profile = this.profileService.createProfile(
      name,
      age,
      gender,
      photos,
      bio,
      location,
      preferredRadius,
      preferredAgeRange,
      preferredGender
    );

    // Subscribe user to notifications
    const observer = new UserNotificationObserver(profile.id, profile.name);
    this.notificationService.subscribe(profile.id, observer);
    this.userObservers.set(profile.id, observer);

    console.log(`✅ Profile created for ${name} (ID: ${profile.id})`);
    return profile;
  }

  /**
   * Get user profile by ID
   * @param userId User ID
   * @returns User profile or null if not found
   */
  getProfile(userId: string): IUserProfile | null {
    return this.profileService.getProfile(userId);
  }

  /**
   * Update user profile
   * @param userId User ID
   * @param updates Profile updates
   * @returns Updated profile or null if user not found
   */
  updateProfile(userId: string, updates: Partial<IUserProfile>): IUserProfile | null {
    return this.profileService.updateProfile(userId, updates);
  }

  /**
   * Get profiles for user's feed
   * @param userId User ID
   * @returns Array of profiles to swipe on
   */
  getFeedProfiles(userId: string): IUserProfile[] {
    return this.matchingService.getFeedProfiles(userId);
  }

  /**
   * Handle user swipe action
   * @param swiperId User performing the swipe
   * @param swipedUserId User being swiped on
   * @param action Swipe action ('like' for swipe right, 'pass' for swipe left)
   * @returns Match if created, null otherwise
   */
  swipe(swiperId: string, swipedUserId: string, action: 'like' | 'pass'): any {
    const swiperProfile = this.profileService.getProfile(swiperId);
    const swipedProfile = this.profileService.getProfile(swipedUserId);
    
    if (!swiperProfile || !swipedProfile) {
      throw new Error('One or both users not found');
    }

    const actionText = action === 'like' ? 'liked' : 'passed on';
    console.log(`👆 ${swiperProfile.name} ${actionText} ${swipedProfile.name}`);

    const match = this.matchingService.swipe(swiperId, swipedUserId, action);
    
    if (match) {
      console.log(`💕 It's a match! ${swiperProfile.name} and ${swipedProfile.name} are now matched!`);
      return match;
    }
    
    return null;
  }

  /**
   * Get user's matches
   * @param userId User ID
   * @returns Array of user's matches
   */
  getUserMatches(userId: string): any[] {
    return this.matchingService.getUserMatches(userId);
  }

  /**
   * Send a message between matched users
   * @param senderId Sender user ID
   * @param receiverId Receiver user ID
   * @param content Message content
   * @returns Sent message or null if users aren't matched
   */
  sendMessage(senderId: string, receiverId: string, content: string): any {
    try {
      const message = this.messagingService.sendMessage(senderId, receiverId, content);
      const senderProfile = this.profileService.getProfile(senderId);
      const receiverProfile = this.profileService.getProfile(receiverId);
      
      if (message && senderProfile && receiverProfile) {
        console.log(`💬 ${senderProfile.name} sent message to ${receiverProfile.name}: "${content}"`);
      }
      
      return message;
    } catch (error) {
      console.error(`❌ Error sending message: ${error}`);
      return null;
    }
  }

  /**
   * Get messages for a match
   * @param matchId Match ID
   * @param userId User requesting messages
   * @returns Array of messages
   */
  getMatchMessages(matchId: string, userId: string): any[] {
    return this.messagingService.getMatchMessages(matchId, userId);
  }

  /**
   * Get user's conversations
   * @param userId User ID
   * @returns Array of conversations
   */
  getUserConversations(userId: string): any[] {
    return this.messagingService.getUserConversations(userId);
  }

  /**
   * Get user's notifications
   * @param userId User ID
   * @returns Array of notifications
   */
  getUserNotifications(userId: string): any[] {
    return this.notificationService.getUserNotifications(userId);
  }

  /**
   * Get unread notifications for user
   * @param userId User ID
   * @returns Array of unread notifications
   */
  getUnreadNotifications(userId: string): any[] {
    return this.notificationService.getUnreadNotifications(userId);
  }

  /**
   * Mark all notifications as read for user
   * @param userId User ID
   */
  markAllNotificationsAsRead(userId: string): void {
    this.notificationService.markAllAsRead(userId);
  }

  /**
   * Get users who liked the current user
   * @param userId User ID
   * @returns Array of user profiles who liked this user
   */
  getUsersWhoLikedMe(userId: string): IUserProfile[] {
    return this.matchingService.getUsersWhoLikedMe(userId);
  }

  /**
   * Search profiles by name or bio
   * @param query Search query
   * @returns Array of matching profiles
   */
  searchProfiles(query: string): IUserProfile[] {
    return this.profileService.searchProfiles(query);
  }

  /**
   * Get app statistics
   * @returns App statistics object
   */
  getAppStatistics(): {
    totalUsers: number;
    totalMatches: number;
    totalMessages: number;
  } {
    return {
      totalUsers: this.profileService.getUserCount(),
      totalMatches: this.matchingService.getTotalMatches(),
      totalMessages: this.messagingService.getTotalMessageCount()
    };
  }

  /**
   * Simulate user location update
   * @param userId User ID
   * @param newLocation New location
   * @returns Updated profile or null
   */
  updateUserLocation(userId: string, newLocation: ILocation): IUserProfile | null {
    return this.profileService.updateProfile(userId, { location: newLocation });
  }

  /**
   * Get profiles near a location
   * @param location Location to search around
   * @param radiusKm Search radius in kilometers
   * @returns Array of profiles within radius
   */
  getProfilesNearLocation(location: ILocation, radiusKm: number): IUserProfile[] {
    return this.profileService.getProfilesNearLocation(location, radiusKm);
  }

  /**
   * Check if two users are matched
   * @param user1Id First user ID
   * @param user2Id Second user ID
   * @returns True if users are matched
   */
  areUsersMatched(user1Id: string, user2Id: string): boolean {
    return this.matchingService.areUsersMatched(user1Id, user2Id);
  }

  /**
   * Display user profile summary
   * @param userId User ID
   */
  displayUserProfile(userId: string): void {
    const profile = this.profileService.getProfile(userId);
    if (profile) {
      console.log(`\n👤 ${profile.name}, ${profile.age} (${profile.gender})`);
      console.log(`📍 Location: ${profile.location.latitude}, ${profile.location.longitude}`);
      console.log(`📝 Bio: ${profile.bio}`);
      console.log(`🔍 Preferred radius: ${profile.preferredRadius}km`);
      console.log(`📸 Photos: ${profile.photos.length} photos`);
    }
  }
} 