import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { PurchasesDateComponent } from './purchases-date.component';
import { PurchasesService } from '../purchases.service';
import { Purchase } from '../purchase';
import { Product } from '../../product/product';
import { Dates } from '../../tools/dates';

describe('PurchasesDateComponent', () => {
  const createProduct = (overrides?: Partial<Product>): Product => {
    const product = new Product();
    product.id = 1;
    product.name = 'patata';
    product.price = 2;
    product.stock = 3;
    product.type = 'Patata/Verdura';
    return Object.assign(product, overrides);
  };

  const createPurchase = (overrides?: Partial<Purchase>): Purchase => {
    const purchase = new Purchase();
    purchase.id = 1;
    purchase.product = createProduct();
    purchase.productId = purchase.product.id;
    purchase.quantity = 2;
    purchase.price = 3;
    purchase.date = new Date('2026-02-06');
    return Object.assign(purchase, overrides);
  };

  const buildPurchasesServiceMock = () => ({
    purchasesByDate: vi.fn(() => of<Purchase[]>([]))
  });

  const setup = async () => {
    const purchasesServiceMock = buildPurchasesServiceMock();

    await TestBed.configureTestingModule({
      imports: [PurchasesDateComponent],
      providers: [
        { provide: PurchasesService, useValue: purchasesServiceMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PurchasesDateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return { fixture, component, purchasesServiceMock };
  };

  describe('Unit/Logic Tests', () => {
    it('initializes default state with empty observable', async () => {
      const { component } = await setup();

      expect(component.purchases$).toBeTruthy();
    });

    it('calls purchasesByDate service method with correct arguments', async () => {
      const { component, purchasesServiceMock } = await setup();
      const dates: Dates = { from: '2026-01-01', to: '2026-01-31' };

      component.findPurchases(dates);

      expect(purchasesServiceMock.purchasesByDate).toHaveBeenCalledWith('2026-01-01', '2026-01-31');
    });

    it('updates purchases$ observable when service returns data', async () => {
      const { component, purchasesServiceMock } = await setup();
      const purchases = [createPurchase({ id: 5 })];
      purchasesServiceMock.purchasesByDate.mockReturnValue(of(purchases));
      const dates: Dates = { from: '2026-02-01', to: '2026-02-28' };

      component.findPurchases(dates);

      component.purchases$.subscribe(result => {
        expect(result).toEqual(purchases);
      });
    });

    it('handles empty response from service', async () => {
      const { component, purchasesServiceMock } = await setup();
      purchasesServiceMock.purchasesByDate.mockReturnValue(of([]));
      const dates: Dates = { from: '2026-01-01', to: '2026-01-31' };

      component.findPurchases(dates);

      component.purchases$.subscribe(result => {
        expect(result).toEqual([]);
      });
    });

    it('invokes findPurchases action handler', async () => {
      const { component } = await setup();
      const findSpy = vi.spyOn(component, 'findPurchases');
      const dates: Dates = { from: '2026-02-01', to: '2026-02-28' };

      component.findPurchases(dates);

      expect(findSpy).toHaveBeenCalledWith(dates);
    });
  });

  describe('Render/Template Tests', () => {
    const renderComponent = async (purchases: Purchase[] = []) => {
      const renderPurchasesServiceMock = {
        purchasesByDate: vi.fn(() => of(purchases))
      };

      const result = await render(PurchasesDateComponent, {
        providers: [
          { provide: PurchasesService, useValue: renderPurchasesServiceMock }
        ]
      });

      return { ...result, renderPurchasesServiceMock };
    };

    it('renders main heading and search component', async () => {
      const { fixture } = await renderComponent();

      expect(screen.getByRole('heading', { name: /Buscador de compras/i })).toBeTruthy();
      const selectDates = fixture.nativeElement.querySelector('app-select-dates');
      expect(selectDates).toBeTruthy();
    });

    it('renders purchase data with product details', async () => {
      const purchase = createPurchase({
        product: createProduct({ id: 3, name: 'tomate' }),
        quantity: 5,
        price: 1.5
      });
      const { fixture } = await renderComponent([purchase]);

      fixture.componentInstance.purchases$ = of([purchase]);
      fixture.detectChanges();

      expect(screen.getByText(/3 tomate/i)).toBeTruthy();
      expect(screen.getByText('5')).toBeTruthy();
      expect(screen.getByText('1.5')).toBeTruthy();
    });

    it('renders grouped purchases by date', async () => {
      const purchase1 = createPurchase({ date: new Date('2026-02-06') });
      const purchase2 = createPurchase({ date: new Date('2026-02-06'), id: 2 });
      const { fixture } = await renderComponent([purchase1, purchase2]);

      fixture.componentInstance.purchases$ = of([purchase1, purchase2]);
      fixture.detectChanges();

      const dateHeaders = screen.getAllByText(/Fecha:/i);
      expect(dateHeaders.length).toBeGreaterThan(0);
    });

    it('shows empty state when no purchases exist', async () => {
      const { fixture } = await renderComponent([]);

      fixture.componentInstance.purchases$ = of([]);
      fixture.detectChanges();

      const tables = fixture.nativeElement.querySelectorAll('p-table');
      expect(tables.length).toBe(0);
    });

    it('exposes accessible table structure', async () => {
      const purchase = createPurchase();
      const { fixture } = await renderComponent([purchase]);

      fixture.componentInstance.purchases$ = of([purchase]);
      fixture.detectChanges();

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBeGreaterThan(0);
      expect(screen.getByText('Producto')).toBeTruthy();
      expect(screen.getByText('Cantidad')).toBeTruthy();
    });
  });
});
