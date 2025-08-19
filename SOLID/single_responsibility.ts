/*
This principle states that a class should have only one reason to change, meaning it should have 
a single, well-defined job or responsibility. This makes the code easier to test, understand, and
maintain. For example, a class for managing users should not also handle sending emails; a separate
class should handle the email functionality.
*/

/* ------ Not Following Principle ------ */

class UserProfile {
  private userName: string;
  private email: string;

  constructor(userName: string, email: string) {
    this.userName = userName;
    this.email = email;
  }

  saveUser() {
    // Logic to save user data to a database
    console.log(`Saving user ${this.userName} with email ${this.email} to the database.`);
  }

  sendWelcomeEmail() {
    // Logic to send a welcome email notification
    console.log(`Sending a welcome email to ${this.email}.`);
  }
}

// Usage
const newUser = new UserProfile("JohnDoe", "john.doe@example.com");
newUser.saveUser();
newUser.sendWelcomeEmail();


/* ------ Following Principle ------ */

// Responsibility 1: Managing user data
class UserRepository {
  save(userName: string, email: string): void {
    // Logic to save user data to a database
    console.log(`Saving user ${userName} with email ${email} to the database.`);
  }
}

// Responsibility 2: Handling notifications
class EmailService {
  sendWelcomeEmail(email: string): void {
    // Logic to send a welcome email notification
    console.log(`Sending a welcome email to ${email}.`);
  }
}

// A new class to coordinate the responsibilities
class UserRegistration {
  private userRepository: UserRepository;
  private emailService: EmailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.emailService = new EmailService();
  }

  registerUser(userName: string, email: string): void {
    this.userRepository.save(userName, email);
    this.emailService.sendWelcomeEmail(email);
  }
}

// Usage
const userRegistration = new UserRegistration();
userRegistration.registerUser("JaneDoe", "jane.doe@example.com");
