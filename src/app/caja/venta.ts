import { Producto } from "../producto/producto";

export class Venta {
    producto: Producto;
    cantidad: number;
    precio: number;

    constructor() {
        
        this.producto = null;
        this.cantidad = 0;
        this.precio= 0;
        
    }
}