
import { ItemSale } from './item-sale';

export class Sale {
    id: number = 0;
    date: Date = new Date();
    creditCard: boolean = false;
    itemsSale: ItemSale[] = [];
}