import { IUserProfile, IMatch, ISwipeAction, IMatchingStrategy } from '../interfaces';
import { Match } from '../models/Match';
import { ProfileService } from './ProfileService';
import { NotificationService } from './NotificationService';

// Strategy Pattern: Different matching algorithms
export class LocationBasedMatchingStrategy implements IMatchingStrategy {
  findMatches(user: IUserProfile, allUsers: IUserProfile[]): IUserProfile[] {
    // This is handled in ProfileService.getEligibleProfiles
    return allUsers.filter(u => u.id !== user.id);
  }
}

export class MatchingService {
  private matches: Map<string, IMatch> = new Map();
  private swipeActions: Map<string, ISwipeAction[]> = new Map();
  private profileService: ProfileService;
  private notificationService: NotificationService;
  private matchingStrategy: IMatchingStrategy;

  constructor(
    profileService: ProfileService,
    notificationService: NotificationService,
    matchingStrategy?: IMatchingStrategy
  ) {
    this.profileService = profileService;
    this.notificationService = notificationService;
    this.matchingStrategy = matchingStrategy || new LocationBasedMatchingStrategy();
  }

  /**
   * Handle user swipe action
   * @param swiperId User performing the swipe
   * @param swipedUserId User being swiped on
   * @param action Swipe action (like or pass)
   * @returns Match if created, null otherwise
   */
  swipe(swiperId: string, swipedUserId: string, action: 'like' | 'pass'): IMatch | null {
    // Record swipe action
    const swipeAction: ISwipeAction = {
      swiperId,
      swipedUserId,
      action,
      timestamp: new Date()
    };

    if (!this.swipeActions.has(swiperId)) {
      this.swipeActions.set(swiperId, []);
    }
    this.swipeActions.get(swiperId)!.push(swipeAction);

    // If it's a pass, no match is possible
    if (action === 'pass') {
      return null;
    }

    // Check if the swiped user also liked the swiper
    const mutualLike = this.checkMutualLike(swiperId, swipedUserId);
    
    if (mutualLike) {
      // Create match
      const match = this.createMatch(swiperId, swipedUserId);
      
      // Send notifications to both users
      const swiperProfile = this.profileService.getProfile(swiperId);
      const swipedProfile = this.profileService.getProfile(swipedUserId);
      
      if (swiperProfile && swipedProfile) {
        this.notificationService.createNotification(
          swiperId,
          'match',
          `You matched with ${swipedProfile.name}!`,
          match.id
        );
        
        this.notificationService.createNotification(
          swipedUserId,
          'match',
          `You matched with ${swiperProfile.name}!`,
          match.id
        );
      }
      
      return match;
    } else {
      // Send like notification to the swiped user
      const swiperProfile = this.profileService.getProfile(swiperId);
      if (swiperProfile) {
        this.notificationService.createNotification(
          swipedUserId,
          'like',
          `${swiperProfile.name} liked your profile!`,
          swiperId
        );
      }
    }

    return null;
  }

  /**
   * Check if two users have mutual likes
   * @param user1Id First user ID
   * @param user2Id Second user ID
   * @returns True if mutual like exists
   */
  private checkMutualLike(user1Id: string, user2Id: string): boolean {
    const user1Swipes = this.swipeActions.get(user1Id) || [];
    const user2Swipes = this.swipeActions.get(user2Id) || [];

    const user1LikedUser2 = user1Swipes.some(
      swipe => swipe.swipedUserId === user2Id && swipe.action === 'like'
    );
    
    const user2LikedUser1 = user2Swipes.some(
      swipe => swipe.swipedUserId === user1Id && swipe.action === 'like'
    );

    return user1LikedUser2 && user2LikedUser1;
  }

  /**
   * Create a match between two users
   * @param user1Id First user ID
   * @param user2Id Second user ID
   * @returns Created match
   */
  private createMatch(user1Id: string, user2Id: string): IMatch {
    const match = new Match(user1Id, user2Id);
    this.matches.set(match.id, match);
    return match;
  }

  /**
   * Get user's matches
   * @param userId User ID
   * @returns Array of user's matches
   */
  getUserMatches(userId: string): IMatch[] {
    return Array.from(this.matches.values()).filter(match =>
      match.includesUser(userId) && match.isActive
    );
  }

  /**
   * Get match by ID
   * @param matchId Match ID
   * @returns Match or null if not found
   */
  getMatch(matchId: string): IMatch | null {
    return this.matches.get(matchId) || null;
  }

  /**
   * Unmatch users (deactivate match)
   * @param matchId Match ID
   * @param userId User requesting unmatch
   * @returns True if successful, false otherwise
   */
  unmatch(matchId: string, userId: string): boolean {
    const match = this.matches.get(matchId);
    if (match && match.includesUser(userId)) {
      match.deactivate();
      return true;
    }
    return false;
  }

  /**
   * Get user's swipe history
   * @param userId User ID
   * @returns Array of swipe actions
   */
  getSwipeHistory(userId: string): ISwipeAction[] {
    return this.swipeActions.get(userId) || [];
  }

  /**
   * Get profiles for user's feed (eligible profiles they haven't swiped on)
   * @param userId User ID
   * @returns Array of profiles for feed
   */
  getFeedProfiles(userId: string): IUserProfile[] {
    const eligibleProfiles = this.profileService.getEligibleProfiles(userId);
    const userSwipes = this.swipeActions.get(userId) || [];
    const swipedUserIds = new Set(userSwipes.map(swipe => swipe.swipedUserId));

    // Return profiles the user hasn't swiped on yet
    return eligibleProfiles.filter(profile => !swipedUserIds.has(profile.id));
  }

  /**
   * Get users who liked the current user
   * @param userId User ID
   * @returns Array of user profiles who liked this user
   */
  getUsersWhoLikedMe(userId: string): IUserProfile[] {
    const likers: IUserProfile[] = [];
    
    for (const [swiperId, swipes] of this.swipeActions.entries()) {
      const likedMe = swipes.some(
        swipe => swipe.swipedUserId === userId && swipe.action === 'like'
      );
      
      if (likedMe) {
        const likerProfile = this.profileService.getProfile(swiperId);
        if (likerProfile) {
          likers.push(likerProfile);
        }
      }
    }
    
    return likers;
  }

  /**
   * Set matching strategy
   * @param strategy New matching strategy
   */
  setMatchingStrategy(strategy: IMatchingStrategy): void {
    this.matchingStrategy = strategy;
  }

  /**
   * Get total number of matches
   * @returns Total match count
   */
  getTotalMatches(): number {
    return Array.from(this.matches.values()).filter(match => match.isActive).length;
  }

  /**
   * Check if two users are matched
   * @param user1Id First user ID
   * @param user2Id Second user ID
   * @returns True if users are matched
   */
  areUsersMatched(user1Id: string, user2Id: string): boolean {
    return Array.from(this.matches.values()).some(match =>
      match.isActive && 
      ((match.user1Id === user1Id && match.user2Id === user2Id) ||
       (match.user1Id === user2Id && match.user2Id === user1Id))
    );
  }
} 