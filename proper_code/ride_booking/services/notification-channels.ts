import { INotificationChannel, NotificationType } from '../interfaces/interface';

// Console notification strategy
class ConsoleNotificationChannel implements INotificationChannel {
  send(recipient: string, message: string, type: NotificationType): void {
    const typeEmoji = this.getTypeEmoji(type);
    console.log(`${typeEmoji} [${recipient}] ${message}`);
  }

  private getTypeEmoji(type: NotificationType): string {
    switch (type) {
      case NotificationType.RIDE_REQUEST:
        return '🚗';
      case NotificationType.RIDE_STARTED:
        return '🚀';
      case NotificationType.RIDE_ENDED:
        return '🏁';
      case NotificationType.RIDE_REQUEST_FULFILLED:
        return '✅';
      default:
        return '🔔';
    }
  }
}

// SMS notification strategy
class SMSNotificationChannel implements INotificationChannel {
  send(recipient: string, message: string, type: NotificationType): void {
    // In a real implementation, this would integrate with SMS service
    console.log(`📱 SMS to ${recipient}: ${message} [Type: ${type}]`);
  }
}

// Email notification strategy
class EmailNotificationChannel implements INotificationChannel {
  send(recipient: string, message: string, type: NotificationType): void {
    // In a real implementation, this would integrate with email service
    console.log(`📧 Email to ${recipient}: ${message} [Type: ${type}]`);
  }
}

// Push notification strategy
class PushNotificationChannel implements INotificationChannel {
  send(recipient: string, message: string, type: NotificationType): void {
    // In a real implementation, this would integrate with push notification service
    console.log(`📲 Push notification to ${recipient}: ${message} [Type: ${type}]`);
  }
}

export {
  ConsoleNotificationChannel,
  SMSNotificationChannel,
  EmailNotificationChannel,
  PushNotificationChannel
}; 