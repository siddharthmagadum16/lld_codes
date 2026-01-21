import { VendingMachineState } from "./VendingMachineState";
import { PaymentStrategy } from "../payment/PaymentStrategy";

export class PaymentPendingState extends VendingMachineState {


    dispense(): void {
        const product = this.machine.getSelectedProduct();
        const paymentStrategy = this.machine.getPaymentStrategy();
        const paidAmount = this.machine.getPaidAmount();

        if (!product || !paymentStrategy) {
            console.log("❌ Error: Missing product or payment information.");
            this.machine.setState(this.machine.getReadyState());
            return;
        }

        const result = paymentStrategy.processPayment(product.price, paidAmount);

        if (!result.success) {
            console.log(`❌ ${result.message}`);
            this.machine.setSelectedProduct(null);
            this.machine.setState(this.machine.getReadyState());
            return;
        }

        console.log(`✓ ${result.message}`);
        this.machine.setState(this.machine.getDispensingState());
        this.machine.getState().dispense();
    }

    cancel(): void {
        console.log("✓ Payment cancelled. Refunding...");
        this.machine.setSelectedProduct(null);
        this.machine.setState(this.machine.getReadyState());
    }

    getStateName(): string {
        return "PAYMENT_PENDING";
    }
}
