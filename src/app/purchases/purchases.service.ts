import { Injectable } from '@angular/core';
import { Purchase } from './purchase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};


@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  constructor(private http: HttpClient) { }
  backendUrl = environment.API_URL;

  guardarPurchase(purchases: Purchase[]): Observable<Purchase[]> {
    return this.http.post<Purchase[]>(this.backendUrl + '/purchases/', purchases, httpOptions);
  }

  purchasesByDate(from: string, to: string): Observable<Purchase[]> {
    let dates = { from: from, to: to };
    return this.http.post<Purchase[]>(this.backendUrl + '/purchases/date', dates, httpOptions);
  }

}
