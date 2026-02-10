import { TestBed } from '@angular/core/testing';
import { render, screen, within } from '@testing-library/angular';
import { Observable, of } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { PurchasesComponent } from './purchases.component';
import { ProductsService } from '../../product/products.service';
import { PurchasesService } from '../purchases.service';
import { ToolsService } from '../../tools/tools.service';
import { Product } from '../../product/product';
import { Purchase } from '../purchase';

describe('PurchasesComponent', () => {
  const createProduct = (overrides?: Partial<Product>): Product => {
    const product = new Product();
    product.id = 1;
    product.name = 'manzana';
    product.price = 2;
    product.stock = 3;
    product.type = 'Fruta';
    return Object.assign(product, overrides);
  };

  const createPurchase = (overrides?: Partial<Purchase>): Purchase => {
    const purchase = new Purchase();
    purchase.id = 1;
    purchase.product = createProduct();
    purchase.productId = purchase.product.id;
    purchase.quantity = 2;
    purchase.price = 3;
    return Object.assign(purchase, overrides);
  };

  const buildProductsServiceMock = () => ({
    getProducts$: vi.fn(() => of([createProduct()]))
  });

  const buildPurchasesServiceMock = () => ({
    guardarPurchase: vi.fn<(purchases: Purchase[]) => Observable<Purchase[]>>(() => of([]))
  });

  const buildToolsServiceMock = () => ({});

  const setup = async () => {
    const productsServiceMock = buildProductsServiceMock();
    const purchasesServiceMock = buildPurchasesServiceMock();
    const toolsServiceMock = buildToolsServiceMock();

    await TestBed.configureTestingModule({
      imports: [PurchasesComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: PurchasesService, useValue: purchasesServiceMock },
        { provide: ToolsService, useValue: toolsServiceMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PurchasesComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return { fixture, component, productsServiceMock, purchasesServiceMock };
  };

  describe('Unit/Logic Tests', () => {
    it('initializes default state and required fields', async () => {
      const { component } = await setup();

      expect(component.formGroup).toBeTruthy();
      expect(component.formFields.length).toBe(3);
      expect(component.purchaseList.length).toBe(0);
      expect(component.showNew).toBe(false);
      expect(component.purchaseCompleted).toBe(false);
    });

    it('calls products service on init', async () => {
      const { productsServiceMock } = await setup();

      expect(productsServiceMock.getProducts$).toHaveBeenCalled();
    });

    it('updates state when sending a purchase', async () => {
      const { component, purchasesServiceMock } = await setup();
      const purchase = createPurchase();
      const response = [createPurchase({ id: 9 })];
      purchasesServiceMock.guardarPurchase.mockReturnValue(of(response));
      component.purchaseList = [purchase];

      component.sendPurchase();

      expect(purchasesServiceMock.guardarPurchase).toHaveBeenCalledWith([purchase]);
      expect(component.purchaseCompleted).toBe(true);
      expect(component.purchaseList).toEqual(response);
    });

    it('enforces validation and prevents invalid submit', async () => {
      const { component } = await setup();

      component.onSubmit('submit');

      expect(component.purchaseList.length).toBe(0);
      expect(component.formGroup.touched).toBe(true);
    });

    it('invokes action handlers for button actions', async () => {
      const { component } = await setup();
      const newProductSpy = vi.spyOn(component, 'newProduct');
      const newPurchaseSpy = vi.spyOn(component, 'newPurchase');
      const sendPurchaseSpy = vi.spyOn(component, 'sendPurchase');

      component.showButtonType('AddProduct');
      component.showButtonType('NewPurchase');
      component.showButtonType('SendPruchase');

      expect(newProductSpy).toHaveBeenCalled();
      expect(newPurchaseSpy).toHaveBeenCalled();
      expect(sendPurchaseSpy).toHaveBeenCalled();
    });

    it('guards new purchase reset when confirmation is declined', async () => {
      const { component } = await setup();
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(false);

      component.purchaseList = [createPurchase()];
      component.showNew = true;
      component.purchaseCompleted = false;

      component.newPurchase();

      expect(component.purchaseList.length).toBe(1);
      expect(component.showNew).toBe(true);
      confirmSpy.mockRestore();
    });

    it('resets state when purchase is completed', async () => {
      const { component } = await setup();
      component.purchaseCompleted = true;
      component.purchaseList = [createPurchase()];
      component.showNew = true;

      component.newPurchase();

      expect(component.purchaseList.length).toBe(0);
      expect(component.showNew).toBe(false);
      expect(component.purchaseCompleted).toBe(false);
    });
  });

  describe('Render/Template Tests', () => {
    const renderComponent = async () => {
      const result = await render(PurchasesComponent, {
        providers: [
          { provide: ProductsService, useValue: buildProductsServiceMock() },
          { provide: PurchasesService, useValue: buildPurchasesServiceMock() },
          { provide: ToolsService, useValue: buildToolsServiceMock() }
        ]
      });

      return result;
    };

    it('renders main content and headings', async () => {
      await renderComponent();

      expect(screen.getByRole('heading', { name: /Compras/i })).toBeTruthy();
    });

    it('renders purchase data in the table and total', async () => {
      const purchase = createPurchase({
        product: createProduct({ name: 'peras' }),
        quantity: 4,
        price: 2
      });

      const { fixture } = await render(PurchasesComponent, {
        providers: [
          { provide: ProductsService, useValue: buildProductsServiceMock() },
          { provide: PurchasesService, useValue: buildPurchasesServiceMock() },
          { provide: ToolsService, useValue: buildToolsServiceMock() }
        ],
        componentProperties: {
          purchaseList: [purchase]
        }
      });

      expect(screen.getByText('peras')).toBeTruthy();
      expect(screen.getByText('4')).toBeTruthy();
      expect(screen.getByText('2')).toBeTruthy();
      expect(screen.getByText(/Total:\s*8/i)).toBeTruthy();
    });

    it('shows default UI when purchase not completed', async () => {
      await renderComponent();

      expect(screen.queryByText(/Compra guardada correctamente/i)).toBeNull();
      expect(screen.getByText('Eliminar')).toBeTruthy();
    });

    it('shows completed UI when purchaseCompleted is true', async () => {
      await render(PurchasesComponent, {
        providers: [
          { provide: ProductsService, useValue: buildProductsServiceMock() },
          { provide: PurchasesService, useValue: buildPurchasesServiceMock() },
          { provide: ToolsService, useValue: buildToolsServiceMock() }
        ],
        componentProperties: {
          purchaseCompleted: true
        }
      });

      expect(screen.getByText(/Compra guardada correctamente/i)).toBeTruthy();
      expect(screen.getByText('Id')).toBeTruthy();
      expect(screen.queryByText('Eliminar')).toBeNull();
    });

    it('shows feedback message when purchase is saved', async () => {
      await render(PurchasesComponent, {
        providers: [
          { provide: ProductsService, useValue: buildProductsServiceMock() },
          { provide: PurchasesService, useValue: buildPurchasesServiceMock() },
          { provide: ToolsService, useValue: buildToolsServiceMock() }
        ],
        componentProperties: {
          purchaseCompleted: true
        }
      });

      expect(screen.getByText(/Compra guardada correctamente/i)).toBeTruthy();
    });

    it('exposes accessible text in the UI', async () => {
      await renderComponent();

      const heading = screen.getByRole('heading', { name: /Compras/i });
      expect(heading).toBeTruthy();

      const content = heading.closest('div');
      const sectionQueries = within(content as HTMLElement);
      expect(sectionQueries.getByText(/Total:/i)).toBeTruthy();
    });
  });
});
