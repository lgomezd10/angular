import { Producto } from '../producto/producto';

export class Compra {
    purchaseId: number;
    producto: Producto;
    quantity: number;
    price: number;
    date: Date;
    

    constructor() {

        this.purchaseId = 0;
        this.producto = null;
        this.quantity = 0;
        this.price = 0;
        this.date = new Date();
    }
}