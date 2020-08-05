import { inject, fakeAsync, tick, TestBed } from "@angular/core/testing";
import {
  HttpTestingController,
  HttpClientTestingModule
} from "@angular/common/http/testing";
import {
  HttpClient,
  HttpBackend,
  HttpRequest,
  HttpResponse,
  HttpHandler
} from "@angular/common/http";

import { ProductosService } from './productos.service';
import { Socket, SocketIoModule } from 'ngx-socket-io';

/*describe('ProductosService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, SocketIoModule],
    providers: [ProductosService]
  }));
  it('should be created', () => {
    const service: ProductosService = TestBed.get(ProductosService);
    expect(service).toBeTruthy();
  });
});*/
