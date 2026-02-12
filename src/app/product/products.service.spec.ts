import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Subject, firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { ProductsService } from './products.service';
import { SocketService } from '../services/socket';
import { Product } from './product';
import { environment } from '../../environments/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let socketServiceMock: {
    fromEvent: ReturnType<typeof vi.fn>;
    connectedSocket$: ReturnType<typeof vi.fn>;
  };
  let updateProductsSubject: Subject<Product[]>;
  let connectedSocketSubject: Subject<boolean>;

  const createProduct = (overrides?: Partial<Product>): Product => {
    const product = new Product();
    product.id = 1;
    product.name = 'Patata';
    product.price = 2.5;
    product.stock = 10;
    product.type = 'Verdura';
    return Object.assign(product, overrides);
  };

  const mockProducts: Product[] = [
    createProduct({ id: 1, name: 'Patata' }),
    createProduct({ id: 2, name: 'Tomate', price: 3 }),
    createProduct({ id: 3, name: 'Cebolla', price: 1.5 })
  ];

  beforeEach(() => {
    updateProductsSubject = new Subject<Product[]>();
    connectedSocketSubject = new Subject<boolean>();

    socketServiceMock = {
      fromEvent: vi.fn(() => updateProductsSubject.asObservable()),
      connectedSocket$: vi.fn(() => connectedSocketSubject.asObservable())
    };

    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SocketService, useValue: socketServiceMock }
      ]
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Unit/Logic Tests', () => {
    it('initializes default state with empty products array', () => {
      const req = httpMock.expectOne(`${environment.API_URL}/products`);
      req.flush([]);

      expect(service.products$.getValue()).toEqual([]);
    });

    it('calls backend API on initialization to load products', () => {
      const req = httpMock.expectOne(`${environment.API_URL}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('updates products$ BehaviorSubject when service returns data', () => {
      const req = httpMock.expectOne(`${environment.API_URL}/products`);
      req.flush(mockProducts);

      expect(service.products$.getValue()).toEqual(mockProducts);
    });

    it('handles empty response from backend gracefully', () => {
      const req = httpMock.expectOne(`${environment.API_URL}/products`);
      req.flush([]);

      expect(service.getProducts()).toEqual([]);
    });

    it('catches and handles HTTP errors returning empty array', () => {
      const req = httpMock.expectOne(`${environment.API_URL}/products`);
      req.error(new ProgressEvent('error'));

      expect(service.products$.getValue()).toEqual([]);
    });

    it('subscribes to socket updateProducts$ event on initialization', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush([]);

      expect(socketServiceMock.fromEvent).toHaveBeenCalledWith('updateProducts');
    });

    it('updates products when socket emits new data', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush([]);

      const newProducts = [createProduct({ id: 99, name: 'Lechuga' })];
      updateProductsSubject.next(newProducts);

      expect(service.products$.getValue()).toEqual(newProducts);
    });

    it('reloads products when socket reconnects', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush(mockProducts);

      connectedSocketSubject.next(true);

      const req = httpMock.expectOne(`${environment.API_URL}/products`);
      req.flush(mockProducts);

      expect(req.request.method).toBe('GET');
    });

    it('does not reload products when socket disconnects', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush(mockProducts);

      connectedSocketSubject.next(false);

      httpMock.expectNone(`${environment.API_URL}/products`);
    });

    it('returns products observable from getProducts$()', async () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush(mockProducts);

      const products = await firstValueFrom(service.getProducts$());
      expect(products).toEqual(mockProducts);
    });

    it('returns products array snapshot from getProducts()', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush(mockProducts);

      expect(service.getProducts()).toEqual(mockProducts);
    });

    it('finds product by id with getProduct()', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush(mockProducts);

      const found = service.getProduct(2);

      expect(found).toEqual(mockProducts[1]);
      expect(found?.name).toBe('Tomate');
    });

    it('returns undefined when product id does not exist', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush(mockProducts);

      const found = service.getProduct(999);

      expect(found).toBeUndefined();
    });

    it('finds product by name with getProductByName()', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush(mockProducts);

      const found = service.getProductByName('tomate');

      expect(found).toEqual(mockProducts[1]);
    });

    it('formats name to proper case when searching by name', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush(mockProducts);

      const found = service.getProductByName('  TOMATE  ');

      expect(found).toEqual(mockProducts[1]);
    });

    it('returns undefined when product name does not exist', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush(mockProducts);

      const found = service.getProductByName('Inexistente');

      expect(found).toBeUndefined();
    });

    it('posts edited product to correct endpoint with formatted name', async () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush([]);

      const product = createProduct({ id: 5, name: '  paTATA   nueva  ' });

      // Call service and expect the request
      const responsePromise = firstValueFrom(service.postEditProduct(product));
      
      const req = httpMock.expectOne(`${environment.API_URL}/products/5`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.name).toBe('Patata nueva');
      req.flush({ ...product, name: 'Patata nueva' });

      const response = await responsePromise;
      expect(response?.name).toBe('Patata nueva');
    });

    it('posts new product to correct endpoint with formatted name', async () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush([]);

      const product = createProduct({ name: '  zanahoria  ' });

      // Call service and expect the request
      const responsePromise = firstValueFrom(service.postNewProduct(product));
      
      const req = httpMock.expectOne(`${environment.API_URL}/products/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.name).toBe('Zanahoria');
      req.flush({ ...product, name: 'Zanahoria' });

      const response = await responsePromise;
      expect(response?.name).toBe('Zanahoria');
    });

    it('includes authorization headers in POST requests', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush([]);

      const product = createProduct();
      service.postNewProduct(product).subscribe();

      const req = httpMock.expectOne(`${environment.API_URL}/products/`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Authorization')).toBe('my-auth-token');
      req.flush(product);
    });

    it('unsubscribes from HTTP call on destroy', () => {
      const req = httpMock.expectOne(`${environment.API_URL}/products`);
      req.flush(mockProducts);

      const unsubscribeSpy = vi.spyOn(service['_docSub'], 'unsubscribe');

      service.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('manually triggers loadProducts() to refresh data', () => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush([]);

      service.loadProducts();

      const req = httpMock.expectOne(`${environment.API_URL}/products`);
      req.flush(mockProducts);

      expect(service.getProducts()).toEqual(mockProducts);
    });
  });

  describe('Name Formatting Logic', () => {
    beforeEach(() => {
      httpMock.expectOne(`${environment.API_URL}/products`).flush([]);
    });

    it('trims whitespace from product names', async () => {
      const product = createProduct({ name: '   Pepino   ' });

      const responsePromise = firstValueFrom(service.postNewProduct(product));

      const req = httpMock.expectOne(`${environment.API_URL}/products/`);
      expect(req.request.body.name).toBe('Pepino');
      req.flush(product);

      await responsePromise;
    });

    it('normalizes multiple spaces to single space', async () => {
      const product = createProduct({ name: 'Patata    grande' });

      const responsePromise = firstValueFrom(service.postNewProduct(product));

      const req = httpMock.expectOne(`${environment.API_URL}/products/`);
      expect(req.request.body.name).toBe('Patata grande');
      req.flush(product);

      await responsePromise;
    });

    it('capitalizes first letter and lowercases rest', async () => {
      const product = createProduct({ name: 'TOMATE CHERRY' });

      const responsePromise = firstValueFrom(service.postNewProduct(product));

      const req = httpMock.expectOne(`${environment.API_URL}/products/`);
      expect(req.request.body.name).toBe('Tomate cherry');
      req.flush(product);

      await responsePromise;
    });
  });
});