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

import { ProductosService } from './productos.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Producto } from './producto';
import { RespuestaGet } from './repsuestaget';
import { Socket } from 'ngx-socket-io';
import { RespuestaPost } from './respuestapost';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


class MockSocket {

  datos$: BehaviorSubject<Producto[]> = new BehaviorSubject<Producto[]>([]);

  fromEvent<T>(eventName: string): Observable<Producto[]> {
    return this.datos$;
  }

  modificarEstado(productos: Producto[]) {
    this.datos$.next(productos);
  }
}

describe('ProductosService', () => {
  const mockSocket: MockSocket = new MockSocket();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ProductosService,
      { provide: Socket, useValue: mockSocket }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
  }));
  it('should be created', () => {
    const service: ProductosService = TestBed.get(ProductosService);
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

    it("getProductos$", inject(
      [ProductosService, HttpTestingController],
      fakeAsync((ps: ProductosService, backend: HttpTestingController) => {
        
        let testRequest = backend.expectOne('http://localhost:3000/productos');
        testRequest.flush(respServidor);
        ps.getProductos$().subscribe(_respuesta => {
          respuesta = _respuesta;          
        });
        tick();
        expect(respuesta[0].name).toBe("Manzana");
        backend.verify();
      })
    ));

    it("getProducto", inject(
      [ProductosService, HttpTestingController],
      fakeAsync((ps: ProductosService, backend: HttpTestingController) => {
        let producto;                 
        let testRequest = backend.expectOne('http://localhost:3000/productos');
        testRequest.flush(respServidor);        
        tick();   
        producto = ps.getProducto(1);
        expect(producto.productId).toBe(1);
        backend.verify();
      })
    ));

    it("getProductoPorname", inject(
      [ProductosService, HttpTestingController],
      fakeAsync((ps: ProductosService, backend: HttpTestingController) => {
        let producto;                 
        let testRequest = backend.expectOne('http://localhost:3000/productos');
        testRequest.flush(respServidor);        
        tick();   
        producto = ps.getProductoPorname("manzana");
        expect(producto.productId).toBe(1);
        expect(producto.name).toBe("Manzana");
        backend.verify();
      })
    ));

    it("postModificarProducto", inject(
      [ProductosService, HttpTestingController],
      fakeAsync((ps: ProductosService, backend: HttpTestingController) => {
        let producto;
        let respuesta: RespuestaPost;
        producto = { productId: 1, name: "Manzana", price: 0, type: "", stock: 0 };                     
        ps.postModificarProducto(producto).subscribe(respuestaServ => respuesta = respuestaServ);
        let testRequest: TestRequest = backend.expectOne('http://localhost:3000/productos/1');
        expect(testRequest.request.method).toBe('POST');
        testRequest.flush({status: 200, error: null, response: producto});        
        tick();  
        expect(respuesta.status).toBe(200);
        expect(testRequest.request.body).toBe(producto);  
        //backend.verify();
      })
    ));

    it("postNuevoProducto", inject(
      [ProductosService, HttpTestingController],
      fakeAsync((ps: ProductosService, backend: HttpTestingController) => {
        let producto;
        let respuesta: RespuestaPost;
        producto = { productId: 1, name: "Manzana", price: 0, type: "", stock: 0 };
                     
        ps.postNuevoProducto(producto).subscribe(respuestaServ => respuesta = respuestaServ);
        let testRequest: TestRequest = backend.expectOne('http://localhost:3000/productos/');
        expect(testRequest.request.method).toBe('POST');
        testRequest.flush({status: 200, error: null, response: producto});        
        tick();  
        expect(respuesta.status).toBe(200);
        expect(testRequest.request.body).toBe(producto);  
        //backend.verify();
      })
    ));

  });
});
