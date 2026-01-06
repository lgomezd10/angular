import { Pipe, PipeTransform } from '@angular/core';
import { ProductsService } from './products.service';


@Pipe({
    name: 'product',
    standalone: true
})
export class ProductPipe implements PipeTransform {

    constructor(private productsService: ProductsService) {
    }

    transform(item: number): string | number {
        const product = this.productsService.getProduct(item);
        if (!product) {
            return 'Desconocido';
        }
        return `${product.id} ${product.name}`;
    }

}