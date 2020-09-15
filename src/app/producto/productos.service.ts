import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from './producto';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { RespuestaGet } from './repsuestaget';
import { RespuestaNuevo } from './respuestanuevo';
import { RespuestaPost } from './respuestapost';

import { Socket } from 'ngx-socket-io';

function formatoNombre(nombre: string): string {
  nombre = nombre.trim();
  nombre = nombre.replace(/\s+/g, ' ');
  nombre = nombre.toLowerCase();
  nombre = nombre[0].toUpperCase() + nombre.slice(1);
  return nombre;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})

export class ProductosService {

  actualizacion$ = this.socket.fromEvent<Producto[]>('productosActualizados');

  //productos: Producto[];

  productos$: BehaviorSubject<Producto[]>;

  private _docSub: Subscription;

  tipos: string[] = [
    "Tomate/Verdura",
    "Manzana/Verdura",
    "Patata/Verdura",
    "Cebolla/Verdura",
    "Ajo/Verdura",
    "Pimiento/Verdura",
    "Otros/Verdura",
    "Cerdo/Carne",
    "Pollo/Carne",
    "Otros/Carne",
    "Otros/Otros"
  ]


  constructor(private http: HttpClient, private socket: Socket) {
    this.productos$ = new BehaviorSubject<Producto[]>([]);
    this.cargarProductos();
    this.actualizacion$.subscribe(productos => this.productos$.next(productos),
      err => console.log('error en socket', err));

  }

  @Output() productosActualizados: EventEmitter<Producto> = new EventEmitter();

  backendUrl = 'http://localhost:3000';

  private cargarProductos() {
    this._docSub = this.getProductosServidor().subscribe(respuesta => {
      this.productos$
      console.log("productos del servidor", respuesta.response);
      this.productos$.next(respuesta.response);
    });
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  // repensar la comprobación de productos para ver desde donde lanzamos el error
  getProductos$(): Observable<Producto[]> {
    return this.productos$;
  }

  private getProductos(): Producto[] {    
    return this.productos$.getValue();
  }

  /*private productosCargados(): boolean {
    return (this.productos$ && this.productos$.getValue().length > 0);
  }*/

  getProducto(id: number): Producto {
    return this.productos$.getValue().find(producto => { return producto.id_producto == id });
  }

  getProductoPorNombre(nombre: string): Producto {    
    nombre = formatoNombre(nombre);
    return this.getProductos().find(producto => { return producto.nombre == nombre });
  }

  private getProductosServidor(): Observable<RespuestaGet> {
    return this.http.get<RespuestaGet>(this.backendUrl + '/productos');
  }

  postModificarProducto(producto: Producto): Observable<RespuestaPost> {
    producto.nombre = formatoNombre(producto.nombre);
    return this.http.post<RespuestaPost>(this.backendUrl + '/productos/' +
      producto.id_producto, producto, httpOptions);
  }

  postNuevoProducto(producto: Producto): Observable<RespuestaPost> {
    producto.nombre = formatoNombre(producto.nombre);
    return this.http.post<RespuestaNuevo>(this.backendUrl + '/productos/', producto, httpOptions);
      
  }


}


