import { VendingMachineState } from "./VendingMachineState";
import { PaymentStrategy } from "../payment/PaymentStrategy";

export class MaintenanceState extends VendingMachineState {
    selectItem(productId: string): void {
        console.log("❌ Machine is under maintenance. Please try again later.");
    }

    insertPayment(strategy: PaymentStrategy, amount: number): void {
        console.log("❌ Machine is under maintenance. Please try again later.");
    }

    dispense(): void {
        console.log("❌ Machine is under maintenance.");
    }

    cancel(): void {
        console.log("❌ Machine is under maintenance.");
    }

    getStateName(): string {
        return "MAINTENANCE";
    }

    exitMaintenance(): void {
        console.log("✓ Exiting maintenance mode.");
        this.machine.setState(this.machine.getReadyState());
    }
}
