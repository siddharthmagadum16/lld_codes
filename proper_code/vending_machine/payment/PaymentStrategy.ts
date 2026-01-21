import { PaymentResult } from "../types";

export interface PaymentStrategy {
    processPayment(amount: number, paidAmount: number): PaymentResult;
}
