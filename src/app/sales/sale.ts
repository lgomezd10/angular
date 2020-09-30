import { Producto } from "../producto/producto";

export class Sale {
    producto: Producto;
    quantity: number;
    price: number;

    constructor() {
        
        this.producto = null;
        this.quantity = 0;
        this.price= 0;
        
    }
}