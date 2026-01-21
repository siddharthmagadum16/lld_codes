import { Product } from "./Product";
import { Inventory } from '../interfaces/index'

class Warehouse {

    private inventoryData: Map<string, Inventory> = new Map();
    constructor(private warehouseId: string) { }

    getProduct(skuId: string): Inventory | undefined {
        return this.inventoryData.get(skuId);
        // return this.inventoryData.has(skuId) ? this.inventoryData.get(skuId) : undefined;
    }
    setQuantity(skuId: string, quantity: number) {
        const product = this.getProduct(skuId);
        if (!product) return;
        product.quantity = quantity;
    }

    setInventoryForSkuId(skuId: string, Inventory: Inventory) {
        this.inventoryData.set(skuId, Inventory);
    }

    getId() { return this.warehouseId; }

}

export { Warehouse }