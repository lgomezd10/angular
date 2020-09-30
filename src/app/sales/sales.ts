
import { Sale } from './sale';

export class ItemSales {
    productId: number;
    quantity: number;
    price: number;
}

export class Sales {
    salesId: number;
    date: Date;
    tarjeta: boolean;
    elementos: ItemSales[];
    
    constructor() {
        
        this.salesId = 0;
        this.date = null;
        this.tarjeta = false;
        this.elementos= [];
        
    }
}