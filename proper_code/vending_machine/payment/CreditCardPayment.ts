import { PaymentStrategy } from "./PaymentStrategy";
import { PaymentResult } from "../types";

export class CreditCardPayment implements PaymentStrategy {
    processPayment(amount: number, paidAmount: number): PaymentResult {
        // Simulate credit card processing
        if (paidAmount < amount) {
            return {
                success: false,
                message: `Payment failed. Required: $${amount}`,
            };
        }

        return {
            success: true,
            message: `Credit card payment of $${amount} processed successfully.`,
        };
    }
}
