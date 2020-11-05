import { Product } from "../product/product";

export class ItemSale {
    id: number;
    product: Product;
    quantity: number;
    price: number;

    constructor() {
        this.id = 0;
        this.product = null;
        this.quantity = 0;
        this.price= 0;
        
    }
}