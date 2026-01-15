
import { ItemSale } from './item-sale';

export class Sale {
    id: number = 0;
    date: Date = null;
    creditCard: boolean = false;
    itemsSale: ItemSale[] = [];
}