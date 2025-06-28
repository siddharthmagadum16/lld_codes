import { v4 as uuidv4 } from 'uuid';
import { IUserProfile, ILocation } from '../interfaces';

export class User implements IUserProfile {
  public id: string;
  public name: string;
  public age: number;
  public gender: 'male' | 'female' | 'other';
  public photos: string[];
  public bio: string;
  public location: ILocation;
  public preferredRadius: number;
  public preferredAgeRange: {
    min: number;
    max: number;
  };
  public preferredGender: 'male' | 'female' | 'other' | 'all';

  constructor(
    name: string,
    age: number,
    gender: 'male' | 'female' | 'other',
    photos: string[],
    bio: string,
    location: ILocation,
    preferredRadius: number = 50,
    preferredAgeRange: { min: number; max: number } = { min: 18, max: 65 },
    preferredGender: 'male' | 'female' | 'other' | 'all' = 'all'
  ) {
    this.id = uuidv4();
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.photos = photos;
    this.bio = bio;
    this.location = location;
    this.preferredRadius = preferredRadius;
    this.preferredAgeRange = preferredAgeRange;
    this.preferredGender = preferredGender;
  }

  /**
   * Update user's location
   * @param newLocation New location coordinates
   */
  updateLocation(newLocation: ILocation): void {
    this.location = newLocation;
  }

  /**
   * Update user's photos
   * @param photos Array of photo URLs
   */
  updatePhotos(photos: string[]): void {
    this.photos = photos;
  }

  /**
   * Update user's bio
   * @param bio New bio text
   */
  updateBio(bio: string): void {
    this.bio = bio;
  }

  /**
   * Update user's preferences
   * @param preferences Object containing preference updates
   */
  updatePreferences(preferences: {
    radius?: number;
    ageRange?: { min: number; max: number };
    gender?: 'male' | 'female' | 'other' | 'all';
  }): void {
    if (preferences.radius !== undefined) {
      this.preferredRadius = preferences.radius;
    }
    if (preferences.ageRange !== undefined) {
      this.preferredAgeRange = preferences.ageRange;
    }
    if (preferences.gender !== undefined) {
      this.preferredGender = preferences.gender;
    }
  }

  /**
   * Get user profile summary
   * @returns Formatted profile string
   */
  getProfileSummary(): string {
    return `${this.name}, ${this.age} - ${this.bio}`;
  }
} 