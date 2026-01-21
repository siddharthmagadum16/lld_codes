• The business has multiple warehouses and can store multiple product types.
• Products can be added, removed, or transferred between warehouses.
• Each product has attributes like SKU(Stock Keeping Unit - Unique Id of a Product), name, price, and quantity.
• The system tracks inventory levels and triggers alerts for low stock


Warehouse
Product


Warehouses has products


Product
- skuId
- name
- price

- quantity

InventorySystem
- getIventoryStats()
- lowStockAlert() -> skuId
- getInventory(warehouseId, skudId)

//observer pattern
