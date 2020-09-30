import { Injectable } from '@angular/core';
import { Compra } from './purchases';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

class RespuestaCompra {
  status: number;
    error: number;
    response: {
      actualizados: number[];
    }
}

class Respuestapurchases {
  status: number;
  error: number;
  response: Compra[];
  
}

@Injectable({
  providedIn: 'root'
})
export class purchasesService {

  constructor(private http: HttpClient) { }
  backendUrl = 'http://localhost:3000';

  guardarCompra(purchases: Compra[]): Observable<RespuestaCompra> {
    return this.http.post<RespuestaCompra>(this.backendUrl + '/compra/', purchases, httpOptions);
  }

  purchasesPordates(desde: string, hasta: string): BehaviorSubject<Compra[]> {
    let dates = {desde: desde, hasta: hasta};
    let respuesta: BehaviorSubject<Compra[]> = new BehaviorSubject([]);
    this.http.post<Respuestapurchases>(this.backendUrl + '/purchases/', dates, httpOptions).subscribe(resp => {
      respuesta.next(resp.response);
    });
    return respuesta;
  }
 
}
