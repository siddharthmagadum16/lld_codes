// Dependency Inversion Principle example
// High-level modules should not depend on low-level modules. Both should depend on abstractions.

// User class
class User {
    constructor(
        public id: string,
        public name: string,
        public accountNumber: string,
        public servicePreferred: string
    ) {}
}

// High-level module - Splitwise
class Splitwise {
    private balance: Map<string, number> = new Map();

    constructor(private paymentService: IPayAdapter) {}

    settle(userA: User, userB: User, rupees: number, paise: number): void {
        this.paymentService.pay(userA, userB, rupees, paise);
        console.log(`Settlement completed between ${userA.name} and ${userB.name}`);
    }

    addBalance(userId: string, amount: number): void {
        const currentBalance = this.balance.get(userId) || 0;
        this.balance.set(userId, currentBalance + amount);
    }

    getBalance(userId: string): number {
        return this.balance.get(userId) || 0;
    }
}

// Abstraction - Payment Adapter Interface
interface IPayAdapter {
    pay(senderUser: User, receiverUser: User, rupees: number, paise: number): boolean;
}

// Abstraction - Service Interface
interface IService {
    send(senderAcc: string, receiverAcc: string, amount: number): boolean;
}

// Concrete Implementation - PayAdapter
class PayAdapter implements IPayAdapter {
    private serviceMapping: Map<string, IService> = new Map();

    constructor() {
        // Register payment services
        this.serviceMapping.set("stripe", new Stripe());
        this.serviceMapping.set("paypal", new PayPal());
        this.serviceMapping.set("razorpay", new RazorPay());
    }

    pay(senderUser: User, receiverUser: User, rupees: number, paise: number): boolean {
        // Transform logic
        const amount = rupees + paise / 100;

        // Get the preferred service
        const service = this.serviceMapping.get(senderUser.servicePreferred);
        if (!service) {
            console.error(`Service ${senderUser.servicePreferred} not found`);
            return false;
        }

        // Make the payment
        return service.send(senderUser.accountNumber, receiverUser.accountNumber, amount);
    }
}

// Concrete Implementation - Stripe Service
class Stripe implements IService {
    send(senderAcc: string, receiverAcc: string, amount: number): boolean {
        // Low level logic for Stripe API
        console.log(`Stripe: Transferring $${amount} from ${senderAcc} to ${receiverAcc}`);
        // Simulate API call
        return true;
    }
}

// Concrete Implementation - PayPal Service
class PayPal implements IService {
    send(senderAcc: string, receiverAcc: string, amount: number): boolean {
        // Low level logic for PayPal API
        console.log(`PayPal: Transferring $${amount} from ${senderAcc} to ${receiverAcc}`);
        // Simulate API call
        return true;
    }
}

// Concrete Implementation - RazorPay Service
class RazorPay implements IService {
    send(senderAcc: string, receiverAcc: string, amount: number): boolean {
        // Low level logic for RazorPay API
        console.log(`RazorPay: Transferring ₹${amount} from ${senderAcc} to ${receiverAcc}`);
        // Simulate API call
        return true;
    }
}

// Main function demonstrating DIP
function main(): void {
    // Create users
    const user1 = new User("1", "Alice", "ACC001", "stripe");
    const user2 = new User("2", "Bob", "ACC002", "paypal");

    // Create payment adapter (abstraction)
    const payAdapter = new PayAdapter();

    // Create Splitwise with dependency injection
    const splitwise = new Splitwise(payAdapter);

    // Add some balances
    splitwise.addBalance(user1.id, 100);
    splitwise.addBalance(user2.id, -100);

    // Settle the balance
    splitwise.settle(user2, user1, 100, 0);
}

// Execute main
main();