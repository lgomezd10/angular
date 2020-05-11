import { Pipe, PipeTransform } from '@angular/core';
import { ProductosService } from './productos.service';


@Pipe({
    name: 'producto'
})
export class ProductoPipe implements PipeTransform {    

    constructor(private productosService: ProductosService){      
    }

    transform(item: any): any {
        if (!item) return item;
        return this.productosService.getProducto(item).nombre;
    }

}