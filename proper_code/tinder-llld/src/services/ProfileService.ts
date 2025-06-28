import { IUserProfile, ILocation } from '../interfaces';
import { User } from '../models/User';
import { LocationUtils } from '../utils/LocationUtils';

export class ProfileService {
  private users: Map<string, IUserProfile> = new Map();
  private locationUtils: LocationUtils;

  constructor() {
    this.locationUtils = new LocationUtils();
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
    const user = new User(
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
    
    this.users.set(user.id, user);
    return user;
  }

  /**
   * Get user profile by ID
   * @param userId User ID
   * @returns User profile or null if not found
   */
  getProfile(userId: string): IUserProfile | null {
    return this.users.get(userId) || null;
  }

  /**
   * Update user profile
   * @param userId User ID
   * @param updates Profile updates
   * @returns Updated profile or null if user not found
   */
  updateProfile(userId: string, updates: Partial<IUserProfile>): IUserProfile | null {
    const user = this.users.get(userId);
    if (!user) return null;

    // Update properties
    Object.assign(user, updates);
    return user;
  }

  /**
   * Delete user profile
   * @param userId User ID
   * @returns True if deleted, false if not found
   */
  deleteProfile(userId: string): boolean {
    return this.users.delete(userId);
  }

  /**
   * Get all user profiles
   * @returns Array of all user profiles
   */
  getAllProfiles(): IUserProfile[] {
    return Array.from(this.users.values());
  }

  /**
   * Get profiles within user's preferred radius and criteria
   * @param userId User ID
   * @returns Array of matching profiles
   */
  getEligibleProfiles(userId: string): IUserProfile[] {
    const currentUser = this.users.get(userId);
    if (!currentUser) return [];

    return Array.from(this.users.values()).filter(user => {
      // Exclude self
      if (user.id === userId) return false;

      // Check location radius
      if (!this.locationUtils.isWithinRadius(
        currentUser.location,
        user.location,
        currentUser.preferredRadius
      )) {
        return false;
      }

      // Check age preference
      if (user.age < currentUser.preferredAgeRange.min || 
          user.age > currentUser.preferredAgeRange.max) {
        return false;
      }

      // Check gender preference
      if (currentUser.preferredGender !== 'all' && 
          user.gender !== currentUser.preferredGender) {
        return false;
      }

      return true;
    });
  }

  /**
   * Search profiles by name
   * @param query Search query
   * @returns Array of matching profiles
   */
  searchProfiles(query: string): IUserProfile[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.users.values()).filter(user =>
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.bio.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get profiles by gender
   * @param gender Gender to filter by
   * @returns Array of profiles with specified gender
   */
  getProfilesByGender(gender: 'male' | 'female' | 'other'): IUserProfile[] {
    return Array.from(this.users.values()).filter(user => user.gender === gender);
  }

  /**
   * Get profiles by age range
   * @param minAge Minimum age
   * @param maxAge Maximum age
   * @returns Array of profiles within age range
   */
  getProfilesByAgeRange(minAge: number, maxAge: number): IUserProfile[] {
    return Array.from(this.users.values()).filter(user => 
      user.age >= minAge && user.age <= maxAge
    );
  }

  /**
   * Get profiles near location
   * @param location Location to search around
   * @param radiusKm Search radius in kilometers
   * @returns Array of profiles within radius
   */
  getProfilesNearLocation(location: ILocation, radiusKm: number): IUserProfile[] {
    return Array.from(this.users.values()).filter(user =>
      this.locationUtils.isWithinRadius(location, user.location, radiusKm)
    );
  }

  /**
   * Get user count
   * @returns Total number of users
   */
  getUserCount(): number {
    return this.users.size;
  }
} 