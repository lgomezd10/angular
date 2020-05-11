import { Producto } from '../producto/producto';

export class Compra {
    id_compra: number;
    producto: Producto;
    cantidad: number;
    precio: number;
    fecha: Date;
    

    constructor() {

        this.id_compra = 0;
        this.producto = null;
        this.cantidad = 0;
        this.precio = 0;
        this.fecha = new Date();
    }
}