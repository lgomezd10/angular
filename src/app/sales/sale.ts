import { Product } from "../product/product";

export class Sale {
    product: Product;
    quantity: number;
    price: number;

    constructor() {
        
        this.product = null;
        this.quantity = 0;
        this.price= 0;
        
    }
}