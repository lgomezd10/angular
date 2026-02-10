import { Product } from "../product/product";

export class ItemSale {
    id: number = 0;
    product: Product = new Product();
    quantity: number = 0;
    price: number = 0;
}