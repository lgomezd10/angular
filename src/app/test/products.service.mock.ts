import {SpyObject} from './test.helpers';
import {ProductsService} from '../product/products.service';
import { Product } from '../product/product';
import { Observable, BehaviorSubject } from 'rxjs';

export class MPS {

}

export class MockProductsService extends SpyObject {

    fakeProducts: Product[] = [];
    fakeProducts$: BehaviorSubject<Product[]>;
    fakeProduct: Product;
    getProductsSpy;
    getProduct$Spy;
    cargarProductsSpy;
    getProductSpy;
    postModificarProductSpy;
    getProductPornameSpy;
    postNewProductSpy;


    constructor() {        
        super(ProductsService);        
        this.fakeProducts$ = new BehaviorSubject<Product[]>([]);
        this.fakeProducts = [];
        this.fakeProduct = new Product();
        this.fakeProduct.productId = 1;
        this.getProduct$Spy = this.spy('getProducts$').and.returnValue(this.fakeProducts$);
        this.getProductsSpy = this.spy('getProducts').and.returnValue(this.fakeProducts);
        this.getProductSpy = this.spy('getProduct').and.callFake(() => this.fakeProduct)
        this.postModificarProductSpy = this.spy('postModificarProduct').and.returnValue(this);
        this.getProductPornameSpy = this.spy('getProductPorname').and.callFake((name)=> { 
            let product = new Product();
            product.name = name;
        })
        this.postNewProductSpy = this.spy('postNewProduct').and.callFake(() => {});
            }
     
    subscribe(callback) {
        callback(this.fakeProduct);
    }

    setProducts(products: Product[]) {
        this.fakeProducts = products;
        this.fakeProducts$.next(this.fakeProducts);
    }
    
    setProduct(product: Product) {
        this.fakeProduct = product;
        /*this.fakeproduct.name= product.name;
        this.fakeProduct.productId = product.productId;
        this.fakeproduct.price = product.price;
        this.fakeproduct.type = product.type;*/
        
    }

    getProviders(): Array<any> {
        return [{ provide: ProductsService, useValue: this }];
      }

      cargarFakeProducts() {
          let p1 = new Product();
          let p2 = new Product();

          p1.name = "product1";
          p1.price = 1;
          p2.name = "product2";
          p2.price = 2;
      }

}