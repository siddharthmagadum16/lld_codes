

class Product {
    constructor (private skuId: number, private name: string, private price: number) {}

    getName(): string {
        return this.name;
    }
}

export { Product }