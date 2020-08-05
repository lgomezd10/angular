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

import { ComprasService } from './compras.service';

/*describe('ComprasService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ComprasService]
  }));

  it('should be created', () => {
    const service: ComprasService = TestBed.get(ComprasService);
    expect(service).toBeTruthy();
  });
});*/
