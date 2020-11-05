import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ItemSale } from './item-sale';
import { Observable, BehaviorSubject } from 'rxjs';
import { Sale } from './sale';
import { ProductsService } from '../product/products.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

class ResponseSavedSales {
  message: string;
  salesId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {


  constructor(private http: HttpClient, private productsService: ProductsService) { }

  backendUrl = 'http://localhost:3000';

  saveSales(itemsSale: ItemSale[], creditCard: boolean): Observable<number> {
    let envio = {
      creditCard,
      itemsSale
    }    
    var response: BehaviorSubject<number> = new BehaviorSubject(0);
    this.http.post<ResponseSavedSales>(this.backendUrl + '/sales/', envio, httpOptions).subscribe(resp => {
      response.next(resp.salesId);
    });
    return response;
  }


  updateSales(salesId: number, itemsSale: ItemSale[], creditCard: boolean): Observable<number> {
    let envio = {
      salesId,
      creditCard,
      itemsSale
    }
    var response: BehaviorSubject<number> = new BehaviorSubject(0);
    this.http.post<ResponseSavedSales>(this.backendUrl + '/sales/update/' + salesId, envio, httpOptions).subscribe(resp => {
      response.next(resp.salesId); 
    });
    return response;
  }

  getSale(salesId: number) : BehaviorSubject<Sale> {
    let response: BehaviorSubject<Sale> = new BehaviorSubject(new Sale());
    this.http.get<Sale>(this.backendUrl + '/sales/sale/' + salesId).subscribe(resp => {
      response.next(resp);
    });

    return response;
  }

  salesAListaSale(sale: Sale): ItemSale[] {
    let outcome: ItemSale[] = [];
    let cont: number = 0;
    sale.itemsSale.forEach(item => {
      let actual: ItemSale = new ItemSale();
      actual.product = this.productsService.getProduct(item.id),
      actual.quantity = item.quantity;
      actual.price = item.price;
      outcome[cont] = actual;
      cont++;
    });
    return outcome;
  }


  salesByDate(from: string, to: string): Observable<Sale[]> {
    let dates = {from: from, to: to};
    return this.http.post<Sale[]>(this.backendUrl + '/sales/date', dates, httpOptions);
  }
}
