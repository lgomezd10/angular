import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PurchasesService } from './purchases.service';
import { Purchase } from './purchase';

describe('PurchasesService', () => {
  let service: PurchasesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchasesService, provideHttpClientTesting()]
    });
    service = TestBed.inject(PurchasesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Unit/Logic Tests
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call guardarPurchase and return purchases', () => {
    const purchases: Purchase[] = [{ id: 1 } as Purchase];
    service.guardarPurchase(purchases).subscribe(resp => {
      expect(resp).toEqual(purchases);
    });
    const req = httpMock.expectOne(service.backendUrl + '/purchases/');
    expect(req.request.method).toBe('POST');
    req.flush(purchases);
  });

  it('should call purchasesByDate and return purchases', () => {
    const purchases: Purchase[] = [{ id: 2 } as Purchase];
    service.purchasesByDate('2024-01-01', '2024-01-31').subscribe(resp => {
      expect(resp).toEqual(purchases);
    });
    const req = httpMock.expectOne(service.backendUrl + '/purchases/date');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ from: '2024-01-01', to: '2024-01-31' });
    req.flush(purchases);
  });
});
