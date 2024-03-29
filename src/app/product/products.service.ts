import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from './product';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';

import { Socket } from 'ngx-socket-io';
import { environment } from '@env/environment';

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

  products$: BehaviorSubject<Product[]>;

  connected$: BehaviorSubject<boolean>;

  private _docSub: Subscription;

  backendUrl = environment.API_URL;
 

  constructor(private http: HttpClient, private socket: Socket) {
    this.products$ = new BehaviorSubject<Product[]>([]);
    this.connected$ = new BehaviorSubject<boolean>(false);
    this.loadProducts();
    this.updateProducts$.subscribe(products => this.products$.next(products));

    this.socket.on('connected', resp => {
      if(this.connected$.getValue != resp)
        this.connected$.next(resp);
    });

  }

  connetedServer(): Observable<boolean> {
    return this.connected$;
  }

  private getProductsServer(): Observable<Product[]> {
    return this.http.get<Product[]>(this.backendUrl + '/products');
  }

  loadProducts() {
    this._docSub = this.getProductsServer().subscribe(response => {      
      this.products$.next(response);
    });
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  //TODO repensar la comprobación de products para ver desde donde lanzamos el error
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

  

  postEditProduct(product: Product): Observable<Product> {
    product.name = formatoname(product.name);
    return this.http.post<Product>(this.backendUrl + '/products/' +
      product.id, product, httpOptions);
  }

  postNewProduct(product: Product): Observable<Product> {
    product.name = formatoname(product.name);
    return this.http.post<Product>(this.backendUrl + '/products/', product, httpOptions);
      
  }


}


