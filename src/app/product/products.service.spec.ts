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
import { RespuestaGet } from './responseget';
import { Socket } from 'ngx-socket-io';
import { RespuestaPost } from './responsepost';
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
    let respServidor: RespuestaGet;

    beforeAll(() => {
      respServidor = { status: 200, error: 0, response: [{ productId: 1, name: "Manzana", price: 0, type: "", stock: 0 }] };
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
        expect(product.productId).toBe(1);
        backend.verify();
      })
    ));

    it("getProductPorname", inject(
      [ProductsService, HttpTestingController],
      fakeAsync((ps: ProductsService, backend: HttpTestingController) => {
        let product;                 
        let testRequest = backend.expectOne('http://localhost:3000/products');
        testRequest.flush(respServidor);        
        tick();   
        product = ps.getProductPorname("manzana");
        expect(product.productId).toBe(1);
        expect(product.name).toBe("Manzana");
        backend.verify();
      })
    ));

    it("postModificarProduct", inject(
      [ProductsService, HttpTestingController],
      fakeAsync((ps: ProductsService, backend: HttpTestingController) => {
        let product;
        let respuesta: RespuestaPost;
        product = { productId: 1, name: "Manzana", price: 0, type: "", stock: 0 };                     
        ps.postModificarProduct(product).subscribe(respuestaServ => respuesta = respuestaServ);
        let testRequest: TestRequest = backend.expectOne('http://localhost:3000/products/1');
        expect(testRequest.request.method).toBe('POST');
        testRequest.flush({status: 200, error: null, response: product});        
        tick();  
        expect(respuesta.status).toBe(200);
        expect(testRequest.request.body).toBe(product);  
        //backend.verify();
      })
    ));

    it("postNewProduct", inject(
      [ProductsService, HttpTestingController],
      fakeAsync((ps: ProductsService, backend: HttpTestingController) => {
        let product;
        let respuesta: RespuestaPost;
        product = { productId: 1, name: "Manzana", price: 0, type: "", stock: 0 };
                     
        ps.postNewProduct(product).subscribe(respuestaServ => respuesta = respuestaServ);
        let testRequest: TestRequest = backend.expectOne('http://localhost:3000/products/');
        expect(testRequest.request.method).toBe('POST');
        testRequest.flush({status: 200, error: null, response: product});        
        tick();  
        expect(respuesta.status).toBe(200);
        expect(testRequest.request.body).toBe(product);  
        //backend.verify();
      })
    ));

  });
});
