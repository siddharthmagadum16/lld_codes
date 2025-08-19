/*
The DIP states that high-level modules should not depend on low-level modules; both should depend on 
abstractions (like interfaces). Additionally, abstractions should not depend on details; 
details should depend on abstractions. This principle decouples components, making the system more 
modular and easier to test.
*/

/* ------ Not Following Principle ------ */
// Low-level module: EmailSender
class EmailSender {
    sendEmail(message: string): void {
        console.log(`Sending email with message: ${message}`);
    }
}

// High-level module: NotificationService
class NotificationService {
    private emailSender: EmailSender;

    constructor() {
        // Direct dependency on the concrete low-level class
        this.emailSender = new EmailSender();
    }

    sendNotification(message: string): void {
        this.emailSender.sendEmail(message);
    }
}

// Usage
const service = new NotificationService();
service.sendNotification("Hello, this is a test notification!");


/* ------ Following Principle ------ */


// Abstraction: An interface that both high-level and low-level modules will depend on
interface MessageSender {
    send(message: string): void;
}

// Low-level module: Concrete implementation of the abstraction
class EmailSender2 implements MessageSender {
    send(message: string): void {
        console.log(`Sending email with message: ${message}`);
    }
}

// Another low-level module: A new concrete implementation
class SMSSender2 implements MessageSender {
    send(message: string): void {
        console.log(`Sending SMS with message: ${message}`);
    }
}

// High-level module: Depends on the abstraction, not a concrete class
class NotificationService2 {
    private messageSender: MessageSender;

    // The dependency is "injected" through the constructor
    constructor(sender: MessageSender) {
        this.messageSender = sender;
    }

    sendNotification(message: string): void {
        this.messageSender.send(message);
    }
}

// Usage with EmailSender
const emailSender = new EmailSender2();
const emailService = new NotificationService2(emailSender);
emailService.sendNotification("Hello via email!");

// Usage with SMSSender, no changes to NotificationService were needed
const smsSender = new SMSSender2();
const smsService = new NotificationService2(smsSender);
smsService.sendNotification("Hello via SMS!");