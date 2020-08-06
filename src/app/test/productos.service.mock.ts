import {SpyObject} from './test.helpers';
import {ProductosService} from '../producto/productos.service';
import { Producto } from '../producto/producto';
import { Observable, BehaviorSubject } from 'rxjs';

export class MockProductosService extends SpyObject {

    fakeProductos: Producto[] = [];
    fakeProductos$: BehaviorSubject<Producto[]>;
    fakeProducto: Producto;
    getProductosSpy;
    getProducto$Spy;
    cargarProductosSpy;
    getProductoSpy;
    postModificarProductoSpy;


    constructor() {        
        super(ProductosService);
        this.fakeProductos$ = new BehaviorSubject<Producto[]>([]);
        this.fakeProductos = [];
        this.fakeProducto = new Producto();
        this.fakeProducto.id_producto = 1;
        this.getProducto$Spy = this.spy('getProductos$').and.returnValue(this.fakeProductos$);
        this.getProductosSpy = this.spy('getProductos').and.returnValue(this.fakeProductos);
        this.getProductoSpy = this.spy('getProducto').and.callFake(() => this.fakeProducto)
        this.postModificarProductoSpy = this.spy('postModificarProducto').and.returnValue(this);
    }
     
    subscribe(callback) {
        callback(this.fakeProducto);
    }

    setProductos(productos: Producto[]) {
        this.fakeProductos = productos;
        this.fakeProductos$.next(this.fakeProductos);
    }
    
    setProducto(producto: Producto) {
        this.fakeProducto = producto;
        /*this.fakeProducto.nombre= producto.nombre;
        this.fakeProducto.id_producto = producto.id_producto;
        this.fakeProducto.precio = producto.precio;
        this.fakeProducto.tipo = producto.tipo;*/
        
    }

    getProviders(): Array<any> {
        return [{ provide: ProductosService, useValue: this }];
      }

}