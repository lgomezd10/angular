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


class MockSocket {

  datos$: BehaviorSubject<Producto[]> = new BehaviorSubject<Producto[]>([]);

  fromEvent<T>(eventName: string): Observable<Producto[]> {
    return this.datos$;
  }

  modificarEstado(productos: Producto[]) {
    this.datos$.next(productos);
  }
}

fdescribe('ProductosService', () => {
  const mockSocket: MockSocket = new MockSocket();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ProductosService,
      { provide: Socket, useValue: mockSocket }]
  }));
  it('should be created', () => {
    const service: ProductosService = TestBed.get(ProductosService);
    expect(service).toBeTruthy();
  });

  describe("Obtener Produtos", () => {
    let respuesta;
    let respServidor: RespuestaGet;

    beforeAll(() => {
      respServidor = { status: 200, error: 0, response: [{ id_producto: 1, nombre: "Manzana", precio: 0, tipo: "", stock: 0 }] };
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
        expect(respuesta[0].nombre).toBe("Manzana");
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
        expect(producto.id_producto).toBe(1);
        backend.verify();
      })
    ));

    it("getProductoPorNombre", inject(
      [ProductosService, HttpTestingController],
      fakeAsync((ps: ProductosService, backend: HttpTestingController) => {
        let producto;                 
        let testRequest = backend.expectOne('http://localhost:3000/productos');
        testRequest.flush(respServidor);        
        tick();   
        producto = ps.getProductoPorNombre("manzana");
        console.log(producto);
        expect(producto.id_producto).toBe(1);
        expect(producto.nombre).toBe("Manzana");
        backend.verify();
      })
    ));

    it("postModificarProducto", inject(
      [ProductosService, HttpTestingController],
      fakeAsync((ps: ProductosService, backend: HttpTestingController) => {
        let producto;
        let respuesta: RespuestaPost;
        producto = { id_producto: 1, nombre: "Manzana", precio: 0, tipo: "", stock: 0 }; 
        console.log("El producto es", producto);
                     
        ps.postModificarProducto(producto).subscribe(respuestaServ => {
          //expect(respuesta.status).toBe(200);
          respuesta = respuestaServ;
          console.log("post modificar producto", respuestaServ)
        });
        let testRequest: TestRequest = backend.expectOne('http://localhost:3000/productos/1');
        console.log("lo que manda",testRequest.request.body);
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
        producto = { id_producto: 1, nombre: "Manzana", precio: 0, tipo: "", stock: 0 }; 
        console.log("El producto es", producto);
                     
        ps.postNuevoProducto(producto).subscribe(respuestaServ => {          
          respuesta = respuestaServ;
          console.log("post añadir producto", respuestaServ)
        });
        let testRequest: TestRequest = backend.expectOne('http://localhost:3000/productos/');
        console.log("lo que manda",testRequest.request.body);
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
