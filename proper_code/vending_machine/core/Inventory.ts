import { Product } from "./Product";

export class Inventory {
    private stock: Map<string, { product: Product; quantity: number }>;

    constructor() {
        this.stock = new Map();
    }

    addProduct(product: Product, quantity: number): void {
        const existing = this.stock.get(product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.stock.set(product.id, { product, quantity });
        }
    }

    removeProduct(productId: string): boolean {
        const item = this.stock.get(productId);
        if (item && item.quantity > 0) {
            item.quantity--;
            return true;
        }
        return false;
    }

    getProduct(productId: string): Product | null {
        const item = this.stock.get(productId);
        return item ? item.product : null;
    }

    isAvailable(productId: string): boolean {
        const item = this.stock.get(productId);
        return item !== undefined && item.quantity > 0;
    }

    getAllProducts(): Product[] {
        return Array.from(this.stock.values())
            .filter((item) => item.quantity > 0)
            .map((item) => item.product);
    }

    getQuantity(productId: string): number {
        return this.stock.get(productId)?.quantity || 0;
    }
}
