import { TestBed } from '@angular/core/testing';
import { SalesService } from './sales.service';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ItemSale } from './item-sale';
import { Sale } from './sale';

describe('SalesService', () => {
  let service: SalesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesService, provideHttpClientTesting()]
    });
    service = TestBed.inject(SalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call saveSales and return saleId', () => {
    const items: ItemSale[] = [{ id: 1, product: { id: 1, name: '', price: 0, type: '', stock: 0 }, quantity: 1, price: 10 }];
    service.saveSales(items, true).subscribe(id => {
      expect(id).toBe(123);
    });
    const req = httpMock.expectOne(service.backendUrl + '/sales/');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'ok', saleId: 123 });
  });

  it('should call updateSales and return saleId', () => {
    const items: ItemSale[] = [{ id: 1, product: { id: 1, name: '', price: 0, type: '', stock: 0 }, quantity: 1, price: 10 }];
    service.updateSales(1, items, false).subscribe(id => {
      expect(id).toBe(456);
    });
    const req = httpMock.expectOne(service.backendUrl + '/sales/update/1');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'updated', saleId: 456 });
  });

  it('should call getSale and return sale', () => {
    const sale: Sale = { id: 1, date: new Date(), creditCard: false, itemsSale: [] };
    service.getSale(1).subscribe(resp => {
      expect(resp).toEqual(sale);
    });
    const req = httpMock.expectOne(service.backendUrl + '/sales/sale/1');
    expect(req.request.method).toBe('GET');
    req.flush(sale);
  });

  it('should call salesByDate and return sales', () => {
    const sales: Sale[] = [{ id: 1, date: new Date(), creditCard: false, itemsSale: [] }];
    service.salesByDate('2024-01-01', '2024-01-31').subscribe(resp => {
      expect(resp).toEqual(sales);
    });
    const req = httpMock.expectOne(service.backendUrl + '/sales/date');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ from: '2024-01-01', to: '2024-01-31' });
    req.flush(sales);
  });
});
