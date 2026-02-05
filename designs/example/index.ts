import * as crypto from 'crypto';

// ===========================
// Custom Error Classes
// ===========================

class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class DatabaseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

class DuplicateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateUserError';
  }
}

// ===========================
// Types and Interfaces
// ===========================

interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  isActive: boolean;
}

interface RegistrationInput {
  username: string;
  email: string;
  password: string;
}

interface RegistrationResult {
  success: boolean;
  userId?: string;
  message: string;
  emailSent: boolean;
}

interface DatabaseService {
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsername(username: string): Promise<User | null>;
  createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<string>;
  deleteUser(userId: string): Promise<void>;
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}

interface EmailService {
  sendWelcomeEmail(email: string, username: string): Promise<void>;
}

// ===========================
// Validation Functions
// ===========================

class UserValidator {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;
  private static readonly PASSWORD_MIN_LENGTH = 8;
  private static readonly PASSWORD_MAX_LENGTH = 128;

  static validateEmail(email: string): void {
    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email is required', 'email');
    }

    const trimmedEmail = email.trim();

    if (trimmedEmail.length === 0) {
      throw new ValidationError('Email cannot be empty', 'email');
    }

    if (trimmedEmail.length > 254) {
      throw new ValidationError('Email is too long', 'email');
    }

    if (!this.EMAIL_REGEX.test(trimmedEmail)) {
      throw new ValidationError('Invalid email format', 'email');
    }
  }

  static validateUsername(username: string): void {
    if (!username || typeof username !== 'string') {
      throw new ValidationError('Username is required', 'username');
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length === 0) {
      throw new ValidationError('Username cannot be empty', 'username');
    }

    if (trimmedUsername.length < 3) {
      throw new ValidationError('Username must be at least 3 characters long', 'username');
    }

    if (trimmedUsername.length > 30) {
      throw new ValidationError('Username must not exceed 30 characters', 'username');
    }

    if (!this.USERNAME_REGEX.test(trimmedUsername)) {
      throw new ValidationError(
        'Username can only contain letters, numbers, underscores, and hyphens',
        'username'
      );
    }
  }

  static validatePassword(password: string): void {
    if (!password || typeof password !== 'string') {
      throw new ValidationError('Password is required', 'password');
    }

    if (password.length < this.PASSWORD_MIN_LENGTH) {
      throw new ValidationError(
        `Password must be at least ${this.PASSWORD_MIN_LENGTH} characters long`,
        'password'
      );
    }

    if (password.length > this.PASSWORD_MAX_LENGTH) {
      throw new ValidationError(
        `Password must not exceed ${this.PASSWORD_MAX_LENGTH} characters`,
        'password'
      );
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const complexityCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

    if (complexityCount < 3) {
      throw new ValidationError(
        'Password must contain at least 3 of the following: uppercase letter, lowercase letter, number, special character',
        'password'
      );
    }
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }
}

// ===========================
// Email Service with Retry Logic
// ===========================

class EmailServiceWithRetry implements EmailService {
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        // Simulate email sending (replace with actual email service like SendGrid, AWS SES, etc.)
        console.log(`Sending welcome email to ${email} (Attempt ${attempt})`);
        await this.sendEmail(email, username);
        console.log(`Welcome email sent successfully to ${email}`);
        return;
      } catch (error) {
        lastError = error as Error;
        console.error(`Failed to send email (Attempt ${attempt}/${this.maxRetries}):`, error);

        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt); // Exponential backoff
        }
      }
    }

    throw new Error(`Failed to send welcome email after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  private async sendEmail(email: string, username: string): Promise<void> {
    // Replace this with actual email service integration
    // Example: SendGrid, AWS SES, Nodemailer, etc.
    
    // Simulating email service call
    if (Math.random() > 0.7) { // 30% failure rate for testing
      throw new Error('Email service unavailable');
    }

    // Success case
    return Promise.resolve();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ===========================
// User Registration Service
// ===========================

class UserRegistrationService {
  constructor(
    private database: DatabaseService,
    private emailService: EmailService
  ) {}

  /**
   * Registers a new user with proper validation, error handling, and rollback on failure
   */
  async registerUser(input: RegistrationInput): Promise<RegistrationResult> {
    let userId: string | null = null;
    let isTransactionActive = false;

    try {
      // Step 1: Validate all inputs
      this.validateInputs(input);

      // Step 2: Sanitize inputs
      const sanitizedUsername = UserValidator.sanitizeInput(input.username);
      const sanitizedEmail = UserValidator.sanitizeInput(input.email).toLowerCase();

      // Step 3: Check if user already exists (by email or username)
      await this.checkUserExists(sanitizedEmail, sanitizedUsername);

      // Step 4: Hash the password
      const passwordHash = await this.hashPassword(input.password);

      // Step 5: Begin database transaction
      await this.database.beginTransaction();
      isTransactionActive = true;

      // Step 6: Create user in database
      userId = await this.database.createUser({
        username: sanitizedUsername,
        email: sanitizedEmail,
        passwordHash,
        isActive: true,
      });

      // Step 7: Send welcome email (with retry logic)
      try {
        await this.emailService.sendWelcomeEmail(sanitizedEmail, sanitizedUsername);
        
        // Commit transaction if email sent successfully
        await this.database.commitTransaction();
        isTransactionActive = false;

        return {
          success: true,
          userId,
          message: 'User registered successfully',
          emailSent: true,
        };
      } catch (emailError) {
        // Email failed even after retries - decide on strategy:
        // Option 1: Rollback user creation (strict approach)
        // Option 2: Keep user but flag email as failed (lenient approach)
        
        console.error('Failed to send welcome email:', emailError);

        // Using lenient approach: commit user but return warning
        await this.database.commitTransaction();
        isTransactionActive = false;

        return {
          success: true,
          userId,
          message: 'User registered successfully, but welcome email could not be sent',
          emailSent: false,
        };
      }
    } catch (error) {
      // Rollback transaction if active
      if (isTransactionActive) {
        try {
          await this.database.rollbackTransaction();
          console.log('Transaction rolled back successfully');
        } catch (rollbackError) {
          console.error('Failed to rollback transaction:', rollbackError);
        }
      }

      // Handle specific error types
      if (error instanceof ValidationError) {
        return {
          success: false,
          message: error.message,
          emailSent: false,
        };
      }

      if (error instanceof DuplicateUserError) {
        return {
          success: false,
          message: error.message,
          emailSent: false,
        };
      }

      if (error instanceof DatabaseError) {
        console.error('Database error during registration:', error);
        return {
          success: false,
          message: 'Unable to complete registration. Please try again later.',
          emailSent: false,
        };
      }

      // Unknown error
      console.error('Unexpected error during user registration:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        emailSent: false,
      };
    }
  }

  private validateInputs(input: RegistrationInput): void {
    UserValidator.validateUsername(input.username);
    UserValidator.validateEmail(input.email);
    UserValidator.validatePassword(input.password);
  }

  private async checkUserExists(email: string, username: string): Promise<void> {
    try {
      const [existingUserByEmail, existingUserByUsername] = await Promise.all([
        this.database.findUserByEmail(email),
        this.database.findUserByUsername(username),
      ]);

      if (existingUserByEmail) {
        throw new DuplicateUserError('A user with this email already exists');
      }

      if (existingUserByUsername) {
        throw new DuplicateUserError('A user with this username already exists');
      }
    } catch (error) {
      if (error instanceof DuplicateUserError) {
        throw error;
      }
      throw new DatabaseError('Failed to check if user exists', error as Error);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      // Generate a random salt
      const salt = crypto.randomBytes(16).toString('hex');
      
      // Hash password with salt using PBKDF2
      return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
          if (err) reject(err);
          else resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
      });
    } catch (error) {
      console.error('Failed to hash password:', error);
      throw new Error('Failed to process password');
    }
  }
}

// ===========================
// Example Usage
// ===========================

// Mock database implementation (replace with actual database)
class MockDatabase implements DatabaseService {
  private users: Map<string, User> = new Map();
  private transactionActive = false;
  private transactionData: Map<string, User> | null = null;

  async findUserByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    return user || null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.username === username);
    return user || null;
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<string> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = {
      ...user,
      id: userId,
      createdAt: new Date(),
    };
    this.users.set(userId, newUser);
    return userId;
  }

  async deleteUser(userId: string): Promise<void> {
    this.users.delete(userId);
  }

  async beginTransaction(): Promise<void> {
    this.transactionActive = true;
    this.transactionData = new Map(this.users);
  }

  async commitTransaction(): Promise<void> {
    this.transactionActive = false;
    this.transactionData = null;
  }

  async rollbackTransaction(): Promise<void> {
    if (this.transactionData) {
      this.users = this.transactionData;
    }
    this.transactionActive = false;
    this.transactionData = null;
  }
}

// ===========================
// Main Function
// ===========================

async function main() {
  const database = new MockDatabase();
  const emailService = new EmailServiceWithRetry();
  const registrationService = new UserRegistrationService(database, emailService);

  // Test Case 1: Valid registration
  console.log('\n=== Test Case 1: Valid Registration ===');
  const result1 = await registrationService.registerUser({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'SecurePass123!',
  });
  console.log('Result:', result1);

  // Test Case 2: Duplicate email
  console.log('\n=== Test Case 2: Duplicate Email ===');
  const result2 = await registrationService.registerUser({
    username: 'jane_doe',
    email: 'john@example.com',
    password: 'AnotherPass456!',
  });
  console.log('Result:', result2);

  // Test Case 3: Weak password
  console.log('\n=== Test Case 3: Weak Password ===');
  const result3 = await registrationService.registerUser({
    username: 'weak_user',
    email: 'weak@example.com',
    password: 'short',
  });
  console.log('Result:', result3);

  // Test Case 4: Invalid email
  console.log('\n=== Test Case 4: Invalid Email ===');
  const result4 = await registrationService.registerUser({
    username: 'invalid_email_user',
    email: 'invalid-email',
    password: 'ValidPass123!',
  });
  console.log('Result:', result4);
}

// Run the example
main().catch(console.error);


