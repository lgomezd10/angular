import { inject, fakeAsync, tick, TestBed } from "@angular/core/testing";
import {
  HttpTestingController,
  HttpClientTestingModule,
  TestRequest
} from "@angular/common/http/testing";
import {
  HttpClient,
  HttpBackend,
  HttpRequest,
  HttpResponse,
  HttpHandler
} from "@angular/common/http";

import { ProductsService } from './products.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from './product';
import { Socket } from 'ngx-socket-io';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


class MockSocket {

  datos$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  fromEvent<T>(eventName: string): Observable<Product[]> {
    return this.datos$;
  }

  modificarEstado(products: Product[]) {
    this.datos$.next(products);
  }
}

describe('ProductsService', () => {
  const mockSocket: MockSocket = new MockSocket();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ProductsService,
      { provide: Socket, useValue: mockSocket }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
  }));
  it('should be created', () => {
    const service: ProductsService = TestBed.get(ProductsService);
    expect(service).toBeTruthy();
  });

  describe("Obtener Produtos", () => {
    let respuesta;
    let respServidor: Product[];

    beforeAll(() => {
      respServidor = [{ id: 1, name: "Manzana", price: 0, type: "", stock: 0 }];
    })

    afterEach(() => {

    })

    it("getProducts$", inject(
      [ProductsService, HttpTestingController],
      fakeAsync((ps: ProductsService, backend: HttpTestingController) => {
        
        let testRequest = backend.expectOne('http://localhost:3000/products');
        testRequest.flush(respServidor);
        ps.getProducts$().subscribe(_respuesta => {
          respuesta = _respuesta;          
        });
        tick();
        expect(respuesta[0].name).toBe("Manzana");
        backend.verify();
      })
    ));

    it("getProduct", inject(
      [ProductsService, HttpTestingController],
      fakeAsync((ps: ProductsService, backend: HttpTestingController) => {
        let product;                 
        let testRequest = backend.expectOne('http://localhost:3000/products');
        testRequest.flush(respServidor);        
        tick();   
        product = ps.getProduct(1);
        expect(product.id).toBe(1);
        backend.verify();
      })
    ));

    it("getProductByName", inject(
      [ProductsService, HttpTestingController],
      fakeAsync((ps: ProductsService, backend: HttpTestingController) => {
        let product;                 
        let testRequest = backend.expectOne('http://localhost:3000/products');
        testRequest.flush(respServidor);        
        tick();   
        product = ps.getProductByName("manzana");
        expect(product.id).toBe(1);
        expect(product.name).toBe("Manzana");
        backend.verify();
      })
    ));

    it("postEditProduct", inject(
      [ProductsService, HttpTestingController],
      fakeAsync((ps: ProductsService, backend: HttpTestingController) => {
        let product;
        let respuesta: Product;
        product = { id: 1, name: "Manzana", price: 0, type: "", stock: 0 };                     
        ps.postEditProduct(product).subscribe(respuestaServ => respuesta = respuestaServ);
        let testRequest: TestRequest = backend.expectOne('http://localhost:3000/products/1');
        expect(testRequest.request.method).toBe('POST');
        testRequest.flush({status: 200, error: null, response: product});        
        tick();  
        expect(testRequest.request.body).toBe(product);  
        //backend.verify();
      })
    ));

    it("postNewProduct", inject(
      [ProductsService, HttpTestingController],
      fakeAsync((ps: ProductsService, backend: HttpTestingController) => {
        let product;
        let respuesta: Product;
        product = { id: 1, name: "Manzana", price: 0, type: "", stock: 0 };
                     
        ps.postNewProduct(product).subscribe(respuestaServ => respuesta = respuestaServ);
        let testRequest: TestRequest = backend.expectOne('http://localhost:3000/products/');
        expect(testRequest.request.method).toBe('POST');
        testRequest.flush(product);        
        tick();  
        expect(testRequest.request.body).toBe(product);  
        //backend.verify();
      })
    ));

  });
});
