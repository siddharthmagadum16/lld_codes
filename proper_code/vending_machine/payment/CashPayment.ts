import { PaymentStrategy } from "./PaymentStrategy";
import { PaymentResult, COIN_DENOMINATIONS } from "../types";

export class CashPayment implements PaymentStrategy {
    processPayment(amount: number, paidAmount: number): PaymentResult {
        if (paidAmount < amount) {
            return {
                success: false,
                message: `Insufficient payment. Required: $${amount}, Paid: $${paidAmount}`,
            };
        }

        const changeAmount = paidAmount - amount;
        if (changeAmount === 0) {
            return {
                success: true,
                message: "Payment successful. No change required.",
            };
        }

        const change = this.calculateChange(changeAmount);
        return {
            success: true,
            change,
            message: `Payment successful. Change: $${changeAmount}`,
        };
    }

    private calculateChange(amount: number): Map<number, number> {
        const change = new Map<number, number>();
        let remaining = Math.round(amount * 100); // Convert to cents to avoid floating point issues

        for (const denomination of COIN_DENOMINATIONS) {
            const count = Math.floor(remaining / denomination);
            if (count > 0) {
                change.set(denomination, count);
                remaining -= count * denomination;
            }
        }

        return change;
    }
}
