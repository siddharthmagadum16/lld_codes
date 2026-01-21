import { Inventory } from "./Inventory";
import { Product } from "./Product";
import { VendingMachineState } from "../states/VendingMachineState";
import { ReadyState } from "../states/ReadyState";
import { ItemSelectedState } from "../states/ItemSelectedState";
import { PaymentPendingState } from "../states/PaymentPendingState";
import { DispensingState } from "../states/DispensingState";
import { MaintenanceState } from "../states/MaintenanceState";
import { PaymentStrategy } from "../payment/PaymentStrategy";

export class VendingMachine {
    private static instance: VendingMachine;
    private inventory: Inventory;
    private currentState: VendingMachineState;
    private selectedProduct: Product | null = null;
    private paymentStrategy: PaymentStrategy | null = null;
    private paidAmount: number = 0;

    // State instances
    private readyState: ReadyState;
    private itemSelectedState: ItemSelectedState;
    private paymentPendingState: PaymentPendingState;
    private dispensingState: DispensingState;
    private maintenanceState: MaintenanceState;

    private constructor() {
        this.inventory = new Inventory();

        // Initialize all states
        this.readyState = new ReadyState(this);
        this.itemSelectedState = new ItemSelectedState(this);
        this.paymentPendingState = new PaymentPendingState(this);
        this.dispensingState = new DispensingState(this);
        this.maintenanceState = new MaintenanceState(this);

        // Set initial state
        this.currentState = this.readyState;
    }

    public static getInstance(): VendingMachine {
        if (!VendingMachine.instance) {
            VendingMachine.instance = new VendingMachine();
        }
        return VendingMachine.instance;
    }

    // Public methods
    public selectItem(productId: string): void {
        this.currentState.selectItem(productId);
    }

    public insertPayment(strategy: PaymentStrategy, amount: number): void {
        this.currentState.insertPayment(strategy, amount);
    }

    public cancel(): void {
        this.currentState.cancel();
    }

    public enterMaintenance(): void {
        console.log("🔧 Entering maintenance mode...");
        this.currentState = this.maintenanceState;
    }

    public exitMaintenance(): void {
        if (this.currentState instanceof MaintenanceState) {
            this.currentState.exitMaintenance();
        }
    }

    public displayProducts(): void {
        console.log("\n📋 Available Products:");
        console.log("─".repeat(40));
        const products = this.inventory.getAllProducts();
        products.forEach((product) => {
            const qty = this.inventory.getQuantity(product.id);
            console.log(`[${product.id}] ${product.name} - $${product.price} (Stock: ${qty})`);
        });
        console.log("─".repeat(40));
    }

    public getCurrentStateName(): string {
        return this.currentState.getStateName();
    }

    // Getters
    public getInventory(): Inventory {
        return this.inventory;
    }

    public getState(): VendingMachineState {
        return this.currentState;
    }

    public getSelectedProduct(): Product | null {
        return this.selectedProduct;
    }

    public getPaymentStrategy(): PaymentStrategy | null {
        return this.paymentStrategy;
    }

    public getPaidAmount(): number {
        return this.paidAmount;
    }

    public getReadyState(): ReadyState {
        return this.readyState;
    }

    public getItemSelectedState(): ItemSelectedState {
        return this.itemSelectedState;
    }

    public getPaymentPendingState(): PaymentPendingState {
        return this.paymentPendingState;
    }

    public getDispensingState(): DispensingState {
        return this.dispensingState;
    }

    public getMaintenanceState(): MaintenanceState {
        return this.maintenanceState;
    }

    // Setters
    public setState(state: VendingMachineState): void {
        this.currentState = state;
    }

    public setSelectedProduct(product: Product | null): void {
        this.selectedProduct = product;
    }

    public setPaymentStrategy(strategy: PaymentStrategy | null): void {
        this.paymentStrategy = strategy;
    }

    public setPaidAmount(amount: number): void {
        this.paidAmount = amount;
    }
}
