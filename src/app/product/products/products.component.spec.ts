import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/angular';

import { ProductsComponent } from './products.component';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { ToolsService } from '../../tools/tools.service';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsSubject: BehaviorSubject<Product[]>;
  let productsServiceMock: {
    getProducts$: ReturnType<typeof vi.fn>;
    postEditProduct: ReturnType<typeof vi.fn>;
    getProducts: ReturnType<typeof vi.fn>;
  };
  let toolsServiceMock: { setButtonTypes: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    productsSubject = new BehaviorSubject<Product[]>([]);
    productsServiceMock = {
      getProducts$: vi.fn(() => productsSubject.asObservable()),
      postEditProduct: vi.fn(),
      getProducts: vi.fn(() => [])
    };
    toolsServiceMock = {
      setButtonTypes: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: ToolsService, useValue: toolsServiceMock },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads products on init and sets button types', () => {
    const product1 = new Product();
    product1.name = 'pera';
    const product2 = new Product();
    product2.name = 'platano';

    productsSubject.next([product1, product2]);
    fixture.detectChanges();

    expect(component.products).toEqual([
      { ...product1 },
      { ...product2 }
    ]);
    expect(toolsServiceMock.setButtonTypes).toHaveBeenCalledWith(component.buttons);
  });

  it('shows new product form when AddNew button is clicked', () => {
    component.showButtonType('AddNew');
    expect(component.showNewProduct).toBe(true);
  });

  it('does not save product when price is invalid', () => {
    const alertSpy = vi.spyOn(globalThis, 'alert').mockImplementation(() => {});
    const product = new Product();
    product.price = 0;

    component.saveProduct(product);

    expect(alertSpy).toHaveBeenCalled();
    expect(productsServiceMock.postEditProduct).not.toHaveBeenCalled();
  });

  it('updates product on successful save', () => {
    vi.useFakeTimers();
    const product = new Product();
    product.price = 10;
    const updated = new Product();
    updated.name = 'updated';

    productsServiceMock.postEditProduct.mockReturnValue(of(updated));

    component.saveProduct(product);

    expect(component.updatedProduct.show).toBe(true);
    expect(component.updatedProduct.product).toEqual(updated);

    vi.advanceTimersByTime(5000);
    expect(component.updatedProduct.show).toBe(false);

    vi.useRealTimers();
  });

  it('restores products on save error', () => {
    const product = new Product();
    product.price = 10;

    const fallback = [new Product()];
    fallback[0].name = 'fallback';
    productsServiceMock.getProducts.mockReturnValue(fallback);
    productsServiceMock.postEditProduct.mockReturnValue(throwError(() => new Error('fail')));

    component.saveProduct(product);

    expect(component.products).toEqual(fallback.map(p => ({ ...p })));
  });

  // Template/Render Tests
  describe('Template Rendering', () => {
    it('renders product table with products', async () => {
      const product1 = new Product();
      product1.id = 1;
      product1.name = 'manzana';
      product1.price = 2.5;

      const product2 = new Product();
      product2.id = 2;
      product2.name = 'naranja';
      product2.price = 1.8;

      productsSubject.next([product1, product2]);
      fixture.detectChanges();
      await fixture.whenStable();

      // Product names are in link titles, not visible text
      expect(screen.getByTitle(/manzana details/i)).toBeTruthy();
      expect(screen.getByTitle(/naranja details/i)).toBeTruthy();
      
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(2); // header + 2 products
    });

    it('displays success message after updating product', () => {
      const updated = new Product();
      updated.name = 'producto actualizado';

      component.updatedProduct.show = true;
      component.updatedProduct.product = updated;
      fixture.detectChanges();

      expect(screen.getByText(/Se ha actualizado el producto: producto actualizado/i)).toBeTruthy();
    });

    it('shows new product form when showNewProduct is true', () => {
      component.showNewProduct = true;
      fixture.detectChanges();

      expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('hides new product form by default', () => {
      component.showNewProduct = false;
      fixture.detectChanges();

      // app-new is always in DOM, but the dialog should not be visible
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});