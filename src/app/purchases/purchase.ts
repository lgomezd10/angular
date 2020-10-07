import { Product } from '../product/product';

export class Purchase {
    id: number;
    product: Product;
    quantity: number;
    price: number;
    date: Date;
    

    constructor() {

        this.id = 0;
        this.product = null;
        this.quantity = 0;
        this.price = 0;
        this.date = new Date();
    }
}