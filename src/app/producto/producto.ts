export class Producto {
    id_producto: number;
    nombre: string;
    precio: number;
    tipo: string;
    stock: number;

    constructor() {
        
        this.id_producto = 0;
        this.nombre = "";
        this.precio = 0;
        this.tipo = "";
        this.stock = 0;
        
    }
}