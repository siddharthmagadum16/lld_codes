import { VendingMachineState } from "./VendingMachineState";
import { PaymentStrategy } from "../payment/PaymentStrategy";

export class ItemSelectedState extends VendingMachineState {


    insertPayment(strategy: PaymentStrategy, amount: number): void {
        console.log(`Processing payment...`);
        this.machine.setPaymentStrategy(strategy);
        this.machine.setPaidAmount(amount);
        this.machine.setState(this.machine.getPaymentPendingState());
        this.machine.getState().dispense();
    }



    cancel(): void {
        console.log("✓ Transaction cancelled.");
        this.machine.setSelectedProduct(null);
        this.machine.setState(this.machine.getReadyState());
    }

    getStateName(): string {
        return "ITEM_SELECTED";
    }
}
