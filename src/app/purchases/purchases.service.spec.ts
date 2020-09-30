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

import { purchasesService } from './purchases.service';

/*describe('purchasesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [purchasesService]
  }));

  it('should be created', () => {
    const service: purchasesService = TestBed.get(purchasesService);
    expect(service).toBeTruthy();
  });
});*/
