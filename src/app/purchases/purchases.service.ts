import { Injectable } from '@angular/core';
import { Purchase } from './purchase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

class ResponsePurchase {
  status: number;
  error: number;
  response: {
    actualizados: number[];
  }
}

class Responsepurchases {
  status: number;
  error: number;
  response: Purchase[];

}

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  constructor(private http: HttpClient) { }
  backendUrl = 'http://localhost:3000';

  guardarPurchase(purchases: Purchase[]): Observable<ResponsePurchase> {
    console.log("DESDE PRURCHASES SERVICE se va a guardar", purchases);
    return this.http.post<ResponsePurchase>(this.backendUrl + '/purchases/', purchases, httpOptions);
  }

  purchasesByDate(from: string, to: string): Observable<Purchase[]> {
    let dates = { from: from, to: to };
    return this.http.post<Purchase[]>(this.backendUrl + '/purchases/date', dates, httpOptions);
  }

}
