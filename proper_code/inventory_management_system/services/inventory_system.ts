import { Warehouse } from "../entities/Warehouse";
import { Inventory } from "../interfaces/index";


class WarehouseService implements IPublisher {

    private constructor() {}

    private static warehouses: Map<string, Warehouse> = new Map();
    private static observer

    addWarehouse(warehouse: Warehouse) {
        WarehouseService.warehouses.set(warehouse.getId(), warehouse);
    }

    createInventory(warehouseId: string, skuId: string, inventory: Inventory) {
        const warehouse = WarehouseService.warehouses.get(warehouseId);
        if (!warehouse) {
            console.error('No such warehouse exists');
        }
        warehouse?.setInventoryForSkuId(skuId, inventory);
    }

    replinishInventory(warehouseId: string, skuId: string, quantity: number) {
        const warehouse = WarehouseService.warehouses.get(warehouseId);
        if (!warehouse) {
            console.error('No such warehouse exists');
        }
        warehouse?.setQuantity(skuId, quantity);
    }

    sellInventory(warehouseId: string, skuId: string, sellQty: number) {
        const warehouse = WarehouseService.warehouses.get(warehouseId);
        if (!warehouse) {
            return console.error('No such warehouse exists');
        }
        // warehouse?.setQuantity(skuId, quantity);
        const product = warehouse?.getProduct(skuId);
        if (!product) {
            return console.error('Product with skuId ', skuId, 'doesnt exists in warehouseId ', warehouseId);
        }
        else if (product.quantity < sellQty) {
            return console.error('Product inventory doesnt have ', sellQty, 'stock. It only has ', product.quantity, 'stock.');
        }

        product.quantity -= sellQty;
        if (product.quantity < product.minThreshold) {
            
        }
    }

}