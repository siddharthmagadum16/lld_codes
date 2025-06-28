import { ILocation, ILocationService } from '../interfaces';

export class LocationUtils implements ILocationService {
  /**
   * Calculate distance between two locations using Haversine formula
   * @param location1 First location
   * @param location2 Second location
   * @returns Distance in kilometers
   */
  calculateDistance(location1: ILocation, location2: ILocation): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(location2.latitude - location1.latitude);
    const dLon = this.toRadians(location2.longitude - location1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(location1.latitude)) * Math.cos(this.toRadians(location2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Check if two locations are within specified radius
   * @param location1 First location
   * @param location2 Second location
   * @param radiusKm Radius in kilometers
   * @returns True if within radius, false otherwise
   */
  isWithinRadius(location1: ILocation, location2: ILocation, radiusKm: number): boolean {
    const distance = this.calculateDistance(location1, location2);
    return distance <= radiusKm;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
} 