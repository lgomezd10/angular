
import { ItemSale } from './item-sale';

export class Sale {
    id: number;
    date: Date;
    creditCard: boolean;
    itemsSale: ItemSale[];
    
    constructor() {
        
        this.id = 0;
        this.date = null;
        this.creditCard = false;
        this.itemsSale = [];
        
    }
}