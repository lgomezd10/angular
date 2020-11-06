import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ItemSale } from './item-sale';
import { Observable, BehaviorSubject } from 'rxjs';
import { Sale } from './sale';
import { ProductsService } from '../product/products.service';
import { map, tap } from 'rxjs/operators';
import { environment } from '@env/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

class ResponseSavedSales {
  message: string;
  saleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {


  constructor(private http: HttpClient, private productsService: ProductsService) { }

  backendUrl = environment.API_URL;

  saveSales(itemsSale: ItemSale[], creditCard: boolean): Observable<number> {
    let envio = {
      creditCard,
      itemsSale
    }  
    return this.http.post<ResponseSavedSales>(this.backendUrl + '/sales/', envio, httpOptions).pipe(map(resp => resp.saleId)); 
  }


  updateSales(saleId: number, itemsSale: ItemSale[], creditCard: boolean): Observable<number> {
    let envio = {
      saleId: saleId,
      creditCard,
      itemsSale
    }
    return this.http.post<ResponseSavedSales>(this.backendUrl + '/sales/update/' + saleId, envio, httpOptions).pipe(map(resp => resp.saleId));
    
  }

  getSale(saleId: number) : Observable<Sale> {
    return this.http.get<Sale>(this.backendUrl + '/sales/sale/' + saleId);
  }


  salesByDate(from: string, to: string): Observable<Sale[]> {
    let dates = {from: from, to: to};
    return this.http.post<Sale[]>(this.backendUrl + '/sales/date', dates, httpOptions);
  }
}
