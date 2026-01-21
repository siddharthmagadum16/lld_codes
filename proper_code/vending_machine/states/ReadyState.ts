import { VendingMachineState } from "./VendingMachineState";
import { PaymentStrategy } from "../payment/PaymentStrategy";

export class ReadyState extends VendingMachineState {
    selectItem(productId: string): void {
        const inventory = this.machine.getInventory();

        if (!inventory.isAvailable(productId)) {
            console.log(`❌ Product ${productId} is out of stock or not available.`);
            return;
        }

        const product = inventory.getProduct(productId);
        this.machine.setSelectedProduct(product!);
        console.log(`✓ Selected: ${product!.toString()}`);
        this.machine.setState(this.machine.getItemSelectedState());
    }



    cancel(): void {
        console.log("Nothing to cancel.");
    }

    getStateName(): string {
        return "READY";
    }
}
