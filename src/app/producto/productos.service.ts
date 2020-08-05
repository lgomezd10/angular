import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from './producto';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { RespuestaGet } from './repsuestaget';
import { RespuestaNuevo } from './respuestanuevo';

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
    //this.cargarProductos();
    this.actualizacion$.subscribe(productos => this.productos$.next(productos),
      err => console.log('error en socket', err));

  }

  @Output() productosActualizados: EventEmitter<Producto> = new EventEmitter();

  backendUrl = 'http://localhost:3000';

  private cargarProductos() {    
    this._docSub =this.getProductosServidor().subscribe(respuesta => {
      console.log("productos del servidor", respuesta.response);
      this.productos$.next(respuesta.response);
    });
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  getProductos$(): Observable<Producto[]> {
    if (!this.productosCargados()) {
      this.cargarProductos();
    }
    return this.productos$;
  }

  private getProductos(): Producto[] {
    if (this.productos$ == undefined) this.cargarProductos();
    return this.productos$.getValue();
  }

  productosCargados(): boolean {
     return (this.productos$ && this.productos$.getValue().length > 0);
  }

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

  postModificarProducto(producto: Producto) {
    producto.nombre = formatoNombre(producto.nombre);
    return this.http.post<Producto>(this.backendUrl + '/productos/' +
      producto.id_producto, producto, httpOptions);
  }

  postNuevoProducto(producto: Producto): void {
    producto.nombre = formatoNombre(producto.nombre);
    this.http.post<RespuestaNuevo>(this.backendUrl + '/productos/', producto, httpOptions)
      .subscribe(resp => {
        console.log("añadido producto", resp);
        /* producto.id_producto = resp.response.id_producto;
         let siguiente = this.getProductos();
         siguiente.push(producto);
         this.productos$.next(siguiente);*/
      });
  }
  

}


