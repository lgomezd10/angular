
import { Venta } from './venta';

export class ItemVentas {
    id_producto: number;
    cantidad: number;
    precio: number;
}

export class Ventas {
    id_ventas: number;
    fecha: Date;
    elementos: ItemVentas[];
    
    constructor() {
        
        this.id_ventas = 0;
        this.fecha = null;
        this.elementos= [];
        
    }
}