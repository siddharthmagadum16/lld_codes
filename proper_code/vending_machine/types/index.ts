export interface IProduct {
    id: string;
    name: string;
    price: number;
}

export enum PaymentMethod {
    CASH = "CASH",
    CREDIT_CARD = "CREDIT_CARD",
    MOBILE = "MOBILE",
}

export interface PaymentResult {
    success: boolean;
    change?: Map<number, number>; // denomination -> count
    message: string;
}

export const COIN_DENOMINATIONS = [25, 10, 5, 1]; // quarters, dimes, nickels, pennies
