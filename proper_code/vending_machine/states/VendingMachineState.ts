import { VendingMachine } from "../core/VendingMachine";
import { PaymentStrategy } from "../payment/PaymentStrategy";

export abstract class VendingMachineState {
    constructor(protected machine: VendingMachine) { }

    selectItem(productId: string): void {
        console.log(`❌ Cannot select item in ${this.getStateName()} state.`);
    }

    insertPayment(strategy: PaymentStrategy, amount: number): void {
        console.log(`❌ Cannot process payment in ${this.getStateName()} state.`);
    }

    dispense(): void {
        console.log(`❌ Cannot dispense in ${this.getStateName()} state.`);
    }

    cancel(): void {
        console.log(`❌ Cannot cancel in ${this.getStateName()} state.`);
    }

    abstract getStateName(): string;
}
