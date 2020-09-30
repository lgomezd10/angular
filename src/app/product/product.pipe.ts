import { Pipe, PipeTransform } from '@angular/core';
import { ProductsService } from './products.service';


@Pipe({
    name: 'product'
})
export class ProductPipe implements PipeTransform {    

    constructor(private productsService: ProductsService){      
    }

    transform(item: any): any {
        if (!item) return item;
        return this.productsService.getProduct(item).name;
    }

}