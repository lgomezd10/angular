import { Injectable } from '@angular/core';
import { Compra } from './compra';
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

class RespuestaCompras {
  status: number;
  error: number;
  response: Compra[];
  
}

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private http: HttpClient) { }
  backendUrl = 'http://localhost:3000';

  guardarCompra(compras: Compra[]): Observable<RespuestaCompra> {
    return this.http.post<RespuestaCompra>(this.backendUrl + '/compra/', compras, httpOptions);
  }

  comprasPorFechas(desde: string, hasta: string): BehaviorSubject<Compra[]> {
    let fechas = {desde: desde, hasta: hasta};
    let respuesta: BehaviorSubject<Compra[]> = new BehaviorSubject([]);
    this.http.post<RespuestaCompras>(this.backendUrl + '/compras/', fechas, httpOptions).subscribe(resp => {
      respuesta.next(resp.response);
    });
    return respuesta;
  }
 
}
