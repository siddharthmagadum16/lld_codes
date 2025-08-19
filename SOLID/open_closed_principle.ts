/*
The OCP states that software entities (classes, modules, etc.) should be **open for extension** 
but **closed for modification**. You should be able to add new functionality without changing existing, 
working code. This is often achieved through inheritance or interfaces, allowing you to extend behavior 
without altering the base code.
*/

/* ------ Not Following Principle ------ */
class BillingSystem {
    calculatePayment(subscriptionType: string, price: number): number {
        if (subscriptionType === 'Basic') {
            return price;
        } else if (subscriptionType === 'Standard') {
            return price * 0.9; // 10% discount
        }
        // To add a new subscription, you have to modify this method.
        return 0;
    }
}

// Usage
const billing = new BillingSystem();
console.log(`Basic subscription total: $${billing.calculatePayment('Basic', 100)}`);
console.log(`Standard subscription total: $${billing.calculatePayment('Standard', 100)}`);


/* ------ Following Principle ------ */

// Abstraction: An interface for all subscriptions
interface Subscription {
    calculatePayment(price: number): number;
}

// Concrete implementations of the Subscription interface
class BasicSubscription implements Subscription {
    calculatePayment(price: number): number {
        return price;
    }
}

class StandardSubscription implements Subscription {
    calculatePayment(price: number): number {
        return price * 0.9; // 10% discount
    }
}

class PremiumSubscription implements Subscription {
    calculatePayment(price: number): number {
        return price * 0.8; // 20% discount
    }
}

// The BillingSystem is now closed for modification
class BillingSystem2 {
    calculatePayment(subscription: Subscription, price: number): number {
        return subscription.calculatePayment(price);
    }
}

// Usage
const billing2 = new BillingSystem2();
const basic = new BasicSubscription();
const standard = new StandardSubscription();
const premium = new PremiumSubscription();

console.log(`Basic subscription total: $${billing2.calculatePayment(basic, 100)}`);
console.log(`Standard subscription total: $${billing2.calculatePayment(standard, 100)}`);
console.log(`Premium subscription total: $${billing2.calculatePayment(premium, 100)}`);