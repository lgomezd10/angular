import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from './product';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { RespuestaGet } from './responseget';
import { RespuestaNew } from './responsenew';
import { RespuestaPost } from './responsepost';

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

export class ProductsService {

  actualizacion$ = this.socket.fromEvent<Product[]>('productsActualizados');

  //products: Product[];

  products$: BehaviorSubject<Product[]>;

  private _docSub: Subscription;
 

  constructor(private http: HttpClient, private socket: Socket) {
    this.products$ = new BehaviorSubject<Product[]>([]);
    this.cargarProducts();
    this.actualizacion$.subscribe(products => this.products$.next(products),
      err => console.log('error en socket', err));

  }

  @Output() productsActualizados: EventEmitter<Product> = new EventEmitter();

  backendUrl = 'http://localhost:3000';

  private cargarProducts() {
    this._docSub = this.getProductsServidor().subscribe(respuesta => {
      this.products$
      console.log("products del servidor", respuesta.response);
      this.products$.next(respuesta.response);
    });
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  // repensar la comprobación de products para ver desde donde lanzamos el error
  getProducts$(): Observable<Product[]> {
    return this.products$;
  }

  private getProducts(): Product[] {    
    return this.products$.getValue();
  }

  /*private productsCargados(): boolean {
    return (this.products$ && this.products$.getValue().length > 0);
  }*/

  getProduct(id: number): Product {
    return this.products$.getValue().find(product => { return product.productId == id });
  }

  getProductPorname(name: string): Product {    
    name = formatoname(name);
    return this.getProducts().find(product => { return product.name == name });
  }

  private getProductsServidor(): Observable<RespuestaGet> {
    return this.http.get<RespuestaGet>(this.backendUrl + '/products');
  }

  postModificarProduct(product: Product): Observable<RespuestaPost> {
    product.name = formatoname(product.name);
    return this.http.post<RespuestaPost>(this.backendUrl + '/products/' +
      product.productId, product, httpOptions);
  }

  postNewProduct(product: Product): Observable<RespuestaPost> {
    product.name = formatoname(product.name);
    return this.http.post<RespuestaNew>(this.backendUrl + '/products/', product, httpOptions);
      
  }


}


