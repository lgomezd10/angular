import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from './product';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { RespuestaGet } from './repsuestaget';
import { RespuestaNuevo } from './respuestanuevo';
import { RespuestaPost } from './respuestapost';

import { Socket } from 'ngx-socket-io';

function formatoname(name: string): string {
  name = name.trim();
  name = name.replace(/\s+/g, ' ');
  name = name.toLowerCase();
  name = name[0].toUpperCase() + name.slice(1);
  return name;
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
    return this.productos$.getValue().find(producto => { return producto.productId == id });
  }

  getProductoPorname(name: string): Producto {    
    name = formatoname(name);
    return this.getProductos().find(producto => { return producto.name == name });
  }

  private getProductosServidor(): Observable<RespuestaGet> {
    return this.http.get<RespuestaGet>(this.backendUrl + '/productos');
  }

  postModificarProducto(producto: Producto): Observable<RespuestaPost> {
    producto.name = formatoname(producto.name);
    return this.http.post<RespuestaPost>(this.backendUrl + '/productos/' +
      producto.productId, producto, httpOptions);
  }

  postNuevoProducto(producto: Producto): Observable<RespuestaPost> {
    producto.name = formatoname(producto.name);
    return this.http.post<RespuestaNuevo>(this.backendUrl + '/productos/', producto, httpOptions);
      
  }


}


