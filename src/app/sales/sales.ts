
import { Sale } from './sale';

export class Sales {
    id: number;
    date: Date;
    creditCard: boolean;
    sale: Sale[];
    
    constructor() {
        
        this.id = 0;
        this.date = null;
        this.creditCard = false;
        this.sale = [];
        
    }
}