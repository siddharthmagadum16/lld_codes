import { IProduct } from "../types/index";

export class Product implements IProduct {
    constructor(
        public id: string,
        public name: string,
        public price: number
    ) { }

    toString(): string {
        return `${this.name} ($${this.price})`;
    }
}
