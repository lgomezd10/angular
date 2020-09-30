import { Product } from '../product/product';

export class Compra {
    purchaseId: number;
    product: Product;
    quantity: number;
    price: number;
    date: Date;
    

    constructor() {

        this.purchaseId = 0;
        this.product = null;
        this.quantity = 0;
        this.price = 0;
        this.date = new Date();
    }
}