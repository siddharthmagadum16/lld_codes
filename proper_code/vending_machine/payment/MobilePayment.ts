import { PaymentStrategy } from "./PaymentStrategy";
import { PaymentResult } from "../types";

export class MobilePayment implements PaymentStrategy {
    processPayment(amount: number, paidAmount: number): PaymentResult {
        // Simulate mobile payment (UPI/wallet)
        if (paidAmount < amount) {
            return {
                success: false,
                message: `Payment failed. Required: $${amount}`,
            };
        }

        return {
            success: true,
            message: `Mobile payment of $${amount} processed successfully.`,
        };
    }
}
