import { INotificationObserver } from '../interfaces/interface';

// Example observer for analytics/logging
class AnalyticsObserver implements INotificationObserver {
  private rideRequestCount = 0;
  private rideStartedCount = 0;
  private rideEndedCount = 0;
  private rideRequestFulfilledCount = 0;

  onRideRequested(driverName: string, userRequest: string): void {
    this.rideRequestCount++;
    console.log(`📊 Analytics: Total ride requests: ${this.rideRequestCount}`);
  }

  onRideStarted(userName: string, driverName: string): void {
    this.rideStartedCount++;
    console.log(`📊 Analytics: Total rides started: ${this.rideStartedCount}`);
  }

  onRideEnded(userName: string, price: number): void {
    this.rideEndedCount++;
    console.log(`📊 Analytics: Total rides ended: ${this.rideEndedCount}, Total revenue: ${price} INR`);
  }

  onRideRequestFulfilled(driverName: string): void {
    this.rideRequestFulfilledCount++;
    console.log(`📊 Analytics: Total fulfilled requests: ${this.rideRequestFulfilledCount}`);
  }

  getStats() {
    return {
      rideRequests: this.rideRequestCount,
      ridesStarted: this.rideStartedCount,
      ridesEnded: this.rideEndedCount,
      requestsFulfilled: this.rideRequestFulfilledCount
    };
  }
}

export default AnalyticsObserver; 