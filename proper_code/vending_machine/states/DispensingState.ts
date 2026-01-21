import { VendingMachineState } from "./VendingMachineState";
import { PaymentStrategy } from "../payment/PaymentStrategy";

export class DispensingState extends VendingMachineState {


    dispense(): void {
        const product = this.machine.getSelectedProduct();
        const paymentStrategy = this.machine.getPaymentStrategy();
        const paidAmount = this.machine.getPaidAmount();

        if (!product || !paymentStrategy) {
            console.log("❌ Error during dispensing.");
            this.machine.setState(this.machine.getReadyState());
            return;
        }

        // Remove from inventory
        this.machine.getInventory().removeProduct(product.id);

        console.log(`\n🎉 Dispensing: ${product.toString()}`);

        // Dispense change if cash payment
        const result = paymentStrategy.processPayment(product.price, paidAmount);
        if (result.change && result.change.size > 0) {
            console.log("💰 Dispensing change:");
            result.change.forEach((count: number, denomination: number) => {
                const coinName = this.getCoinName(denomination);
                console.log(`   ${count} × ${coinName}(s)`);
            });
        }

        console.log("✓ Thank you for your purchase!\n");

        // Reset
        this.machine.setSelectedProduct(null);
        this.machine.setState(this.machine.getReadyState());
    }

    cancel(): void {
        console.log("❌ Cannot cancel during dispensing.");
    }

    getStateName(): string {
        return "DISPENSING";
    }

    private getCoinName(denomination: number): string {
        switch (denomination) {
            case 25:
                return "Quarter";
            case 10:
                return "Dime";
            case 5:
                return "Nickel";
            case 1:
                return "Penny";
            default:
                return `${denomination}¢`;
        }
    }
}
