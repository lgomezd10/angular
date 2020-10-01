
import { Sale } from './sale';

export class ItemSales {
    id: number;
    quantity: number;
    price: number;
}

export class Sales {
    salesId: number;
    date: Date;
    creditCard: boolean;
    elementos: ItemSales[];
    
    constructor() {
        
        this.salesId = 0;
        this.date = null;
        this.creditCard = false;
        this.elementos= [];
        
    }
}