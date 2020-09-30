import {SpyObject} from './test.helpers';
import {ProductosService} from '../producto/products.service';
import { Producto } from '../producto/producto';
import { Observable, BehaviorSubject } from 'rxjs';

export class MPS {

}

export class MockProductosService extends SpyObject {

    fakeProductos: Producto[] = [];
    fakeProductos$: BehaviorSubject<Producto[]>;
    fakeProducto: Producto;
    getProductosSpy;
    getProducto$Spy;
    cargarProductosSpy;
    getProductoSpy;
    postModificarProductoSpy;
    getProductoPornameSpy;
    postNuevoProductoSpy;


    constructor() {        
        super(ProductosService);        
        this.fakeProductos$ = new BehaviorSubject<Producto[]>([]);
        this.fakeProductos = [];
        this.fakeProducto = new Producto();
        this.fakeProducto.productId = 1;
        this.getProducto$Spy = this.spy('getProductos$').and.returnValue(this.fakeProductos$);
        this.getProductosSpy = this.spy('getProductos').and.returnValue(this.fakeProductos);
        this.getProductoSpy = this.spy('getProducto').and.callFake(() => this.fakeProducto)
        this.postModificarProductoSpy = this.spy('postModificarProducto').and.returnValue(this);
        this.getProductoPornameSpy = this.spy('getProductoPorname').and.callFake((name)=> { 
            let producto = new Producto();
            producto.name = name;
        })
        this.postNuevoProductoSpy = this.spy('postNuevoProducto').and.callFake(() => {});
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
        /*this.fakeproducto.name= producto.name;
        this.fakeProducto.productId = producto.productId;
        this.fakeproducto.price = producto.price;
        this.fakeproducto.type = producto.type;*/
        
    }

    getProviders(): Array<any> {
        return [{ provide: ProductosService, useValue: this }];
      }

      cargarFakeProductos() {
          let p1 = new Producto();
          let p2 = new Producto();

          p1.name = "producto1";
          p1.price = 1;
          p2.name = "producto2";
          p2.price = 2;
      }

}