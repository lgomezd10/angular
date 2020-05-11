import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from './producto';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { RespuestaGet } from './repsuestaget';
import { RespuestaNuevo } from './respuestanuevo';

import { Socket } from 'ngx-socket-io';


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
    this.getProductosServidor().subscribe(respuesta => {
      console.log("productos del servidor", respuesta.response);
      this.productos$.next(respuesta.response);
    });
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  getProductos$(): Observable<Producto[]> {
    return this.productos$.asObservable();
  }

  getProductos(): Producto[] {
    return this.productos$.getValue();
  }

  getProducto(id: number): Producto {
    
    return this.getProductos().find(producto => { return producto.id_producto == id });
    
      
   /* if (this.productos$.getValue() == undefined) {
      console.log("productos undefine");
      this.getProductosServidor().subscribe(respuesta => {
        console.log("productos del servidor", respuesta.response);

        this.productos$.next(respuesta.response);
        return this.productos$.getValue().find(producto => { return producto.id_producto == id });
      });

    } else
      return this.productos$.getValue().find(producto => { return producto.id_producto == id });*/
  }

  private getProductosServidor(): Observable<RespuestaGet> {
    return this.http.get<RespuestaGet>(this.backendUrl + '/productos');
  }

  postModificarProducto(producto: Producto) {
    producto.nombre = producto.nombre.toLowerCase();
    producto.nombre = producto.nombre[0].toUpperCase() + producto.nombre.slice(1);
    return this.http.post<Producto>(this.backendUrl + '/productos/' +
      producto.id_producto, producto, httpOptions);
  }

  postNuevoProducto(producto: Producto): void {

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


