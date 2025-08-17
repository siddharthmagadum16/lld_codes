import { INotificationChannel, INotificationObserver, NotificationType } from '../interfaces/interface';
import { ConsoleNotificationChannel } from './notification-channels';

class NotificationService {
  // constructor(private id: string, private message: string) { }

  private static instance: NotificationService;
  private channels: Map<string, INotificationChannel> = new Map();
  private observers: INotificationObserver[] = [];

  private constructor() {
    // Initialize with default console channel
    this.channels.set('console', new ConsoleNotificationChannel());
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Strategy pattern - manage different notification channels
  public addChannel(name: string, channel: INotificationChannel): void {
    this.channels.set(name, channel);
  }

  public removeChannel(name: string): void {
    this.channels.delete(name);
  }

  public getChannel(name: string): INotificationChannel | undefined {
    return this.channels.get(name);
  }

  // Observer pattern - manage notification observers
  public subscribe(observer: INotificationObserver): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: INotificationObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  // Generic notification method
  public notify(recipient: string, message: string, type: NotificationType = NotificationType.GENERAL, channelName: string = 'console'): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.send(recipient, message, type);
    } else {
      console.error(`Notification channel '${channelName}' not found`);
    }
  }

  // Event-specific notification methods that notify observers
  public notifyRideRequested(driverName: string, userRequest: string): void {
    this.notify(driverName, `New Ride Request from ${userRequest}`, NotificationType.RIDE_REQUEST);
    this.observers.forEach(observer => observer.onRideRequested(driverName, userRequest));
  }

  public notifyRideStarted(userName: string, driverName: string): void {
    this.notify(userName, `Your ride has started. Driver's name is ${driverName}`, NotificationType.RIDE_STARTED);
    this.observers.forEach(observer => observer.onRideStarted(userName, driverName));
  }

  public notifyRideEnded(userName: string, price: number): void {
    this.notify(userName, `Your ride has ended. Kindly pay ${price} INR`, NotificationType.RIDE_ENDED);
    this.observers.forEach(observer => observer.onRideEnded(userName, price));
  }

  public notifyRideRequestFulfilled(driverName: string): void {
    this.notify(driverName, 'This ride request is already fulfilled by other driver', NotificationType.RIDE_REQUEST_FULFILLED);
    this.observers.forEach(observer => observer.onRideRequestFulfilled(driverName));
  }

  // Multi-channel notification
  public notifyAllChannels(recipient: string, message: string, type: NotificationType = NotificationType.GENERAL): void {
    this.channels.forEach((channel, channelName) => {
      channel.send(recipient, message, type);
    });
  }
}

export default NotificationService;