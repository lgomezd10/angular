import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from './product';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { ResponseNew } from './responsenew';
import { ResponsePost } from './responsepost';

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

  updateProducts$ = this.socket.fromEvent<Product[]>('updateProducts');

  //products: Product[];

  products$: BehaviorSubject<Product[]>;

  private _docSub: Subscription;
 

  constructor(private http: HttpClient, private socket: Socket) {
    this.products$ = new BehaviorSubject<Product[]>([]);
    this.loadProducts();
    this.updateProducts$.subscribe(products => this.products$.next(products),
      err => console.log('error en socket', err));

  }

  //@Output() updateProducts: EventEmitter<Product> = new EventEmitter();

  backendUrl = 'http://localhost:3000';

  private loadProducts() {
    this._docSub = this.getProductsServer().subscribe(response => {      
      
      this.products$.next(response);
      console.log("Desde ProductService GUARDADO EN PRODUCT$", this.products$.getValue())
    });
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  // repensar la comprobación de products para ver from donde lanzamos el error
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
    return this.products$.getValue().find(product => { return product.id == id });
  }

  getProductByName(name: string): Product {    
    name = formatoname(name);
    return this.getProducts().find(product => { return product.name == name });
  }

  private getProductsServer(): Observable<Product[]> {
    return this.http.get<Product[]>(this.backendUrl + '/products');
  }

  postEditProduct(product: Product): Observable<Product> {
    product.name = formatoname(product.name);
    console.log("DESDE PRODUCT SERVICE se va a actualizar el producto", product)
    return this.http.post<Product>(this.backendUrl + '/products/' +
      product.id, product, httpOptions);
  }

  postNewProduct(product: Product): Observable<ResponsePost> {
    product.name = formatoname(product.name);
    return this.http.post<ResponseNew>(this.backendUrl + '/products/', product, httpOptions);
      
  }


}


