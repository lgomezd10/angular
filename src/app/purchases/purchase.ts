import { Product } from '../product/product';

export class Purchase {
    id: number = 0;
    product: Product = new Product();
    productId: number = 0;
    quantity: number = 0;
    price: number = 0;
    date: Date = new Date();

}