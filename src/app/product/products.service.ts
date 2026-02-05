import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from './product';
import { Observable, of, BehaviorSubject, Subscription, catchError } from 'rxjs';

import { SocketService } from '../services/socket';
import { environment } from '@env/environment';

function formatoname(name: string): string {
  name = name.trim();
  name = name.replaceAll(/\s+/g, ' ');
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

export class ProductsService implements OnDestroy {

  updateProducts$ = this.socket.fromEvent<Product[]>('updateProducts');

  products$: BehaviorSubject<Product[]>;

  private _docSub: Subscription;

  backendUrl = environment.API_URL;


  constructor(private readonly http: HttpClient, private readonly socket: SocketService) {
    this.products$ = new BehaviorSubject<Product[]>([]);
    this.loadProducts();
    this.updateProducts$.subscribe(products => {
      this.products$.next(products);
    });

    this.socket.connectedSocket$().subscribe(isConnected => {
      if (isConnected)
        this.loadProducts();
    });

  }

  private getProductsServer(): Observable<Product[]> {
    return this.http.get<Product[]>(this.backendUrl + '/products').pipe(
      catchError(() => of([]))
    );

  }

  loadProducts() {
    this._docSub = this.getProductsServer().subscribe(response => {
      this.products$.next(response);
    });
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  getProducts$(): Observable<Product[]> {
    return this.products$;
  }

  getProducts(): Product[] {
    return this.products$.getValue();
  }


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


