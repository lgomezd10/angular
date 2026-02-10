import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/angular';

import { ProductComponent } from './product.component';
import { ProductsService } from '../products.service';
import { Product } from '../product';

describe('ProductComponent', () => {
  let fixture: ComponentFixture<ProductComponent>;
  let component: ProductComponent;
  let productsServiceMock: {
    loadProducts: ReturnType<typeof vi.fn>;
    getProducts$: ReturnType<typeof vi.fn>;
    getProduct: ReturnType<typeof vi.fn>;
    getProductByName: ReturnType<typeof vi.fn>;
    postEditProduct: ReturnType<typeof vi.fn>;
  };
  let locationMock: { back: ReturnType<typeof vi.fn> };

  const createProduct = (overrides?: Partial<Product>): Product => {
    const product = new Product();
    product.id = 1;
    product.name = 'patata';
    product.price = 2;
    product.stock = 3;
    product.type = 'Patata/Verdura';
    return Object.assign(product, overrides);
  };

  const setup = async (routeId: string | null = '1', product = createProduct()) => {
    productsServiceMock = {
      loadProducts: vi.fn(),
      getProducts$: vi.fn(() => of([product])),
      getProduct: vi.fn(() => product),
      getProductByName: vi.fn(() => undefined),
      postEditProduct: vi.fn(() => of(product))
    };
    locationMock = { back: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap(routeId ? { id: routeId } : {})) }
        },
        { provide: Location, useValue: locationMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
  };

  describe('Unit/Logic Tests', () => {
    it('initializes default state and form controls', async () => {
      await setup();

      expect(component.formGroup).toBeTruthy();
      expect(component.formGroup.controls['name']).toBeTruthy();
      expect(component.formGroup.controls['price']).toBeTruthy();
      expect(component.updatedProduct.show).toBe(false);
      expect(component.repeatedProduct).toBe('');
    });

    it('calls services to load and retrieve product', async () => {
      await setup('5', createProduct({ id: 5 }));
      fixture.detectChanges();

      expect(productsServiceMock.loadProducts).toHaveBeenCalled();
      expect(productsServiceMock.getProducts$).toHaveBeenCalled();
      expect(productsServiceMock.getProduct).toHaveBeenCalledWith(5);
    });

    it('updates form state when product is retrieved', async () => {
      const product = createProduct({ id: 7, name: 'manzana', price: 3.5, stock: 10, type: 'Fruta' });
      await setup('7', product);
      fixture.detectChanges();

      expect(component.formGroup.controls['id'].value).toBe(7);
      expect(component.formGroup.controls['name'].value).toBe('manzana');
      expect(component.formGroup.controls['price'].value).toBe(3.5);
      expect(component.formGroup.controls['stock'].value).toBe(10);
      expect(component.formGroup.controls['type'].value).toBe('Fruta');
    });

    it('prevents invalid form submission', async () => {
      await setup();
      fixture.detectChanges();
      component.formGroup.setValue({
        id: 1,
        name: '',
        price: 0,
        type: '',
        stock: 0
      });

      component.editProduct();

      expect(productsServiceMock.postEditProduct).not.toHaveBeenCalled();
    });

    it('invokes action handlers for save and return', async () => {
      await setup();
      const editSpy = vi.spyOn(component, 'editProduct');
      const returnSpy = vi.spyOn(component, 'return');

      component.showButtonType('Save');
      component.showButtonType('Return');

      expect(editSpy).toHaveBeenCalled();
      expect(returnSpy).toHaveBeenCalled();
    });

    it('guards against duplicate product names', async () => {
      await setup('1', createProduct({ id: 1, name: 'pera' }));
      productsServiceMock.getProductByName.mockReturnValue(createProduct({ id: 2, name: 'manzana' }));
      component.buttonName = { nativeElement: { focus: vi.fn() } } as any;
      component.formGroup.setValue({
        id: 1,
        name: 'manzana',
        price: 2,
        type: 'Fruta',
        stock: 5
      });

      component.editProduct();

      expect(component.repeatedProduct).toBe('manzana');
      expect(productsServiceMock.postEditProduct).not.toHaveBeenCalled();
      expect(component.buttonName?.nativeElement.focus).toHaveBeenCalled();
    });
  });

  describe('Render/Template Tests', () => {
    const renderComponent = async (
      product = createProduct(),
      repeatedProduct?: string,
      updatedProduct?: { show: boolean; product: Product | null }
    ) => {
      const resolvedUpdatedProduct = updatedProduct ?? { show: false, product: null };
      const renderProductsServiceMock = {
        loadProducts: vi.fn(),
        getProducts$: vi.fn(() => of([product])),
        getProduct: vi.fn(() => product),
        getProductByName: vi.fn(() => undefined),
        postEditProduct: vi.fn(() => of(product))
      };
      const renderLocationMock = {
        back: vi.fn(),
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
        path: vi.fn(() => ''),
        getState: vi.fn(() => ({})),
        isCurrentPathEqualTo: vi.fn(() => false),
        replaceState: vi.fn()
      };

      const result = await render(ProductComponent, {
        componentProperties: { repeatedProduct, updatedProduct: resolvedUpdatedProduct },
        providers: [
          { provide: ProductsService, useValue: renderProductsServiceMock },
          {
            provide: ActivatedRoute,
            useValue: { paramMap: of(convertToParamMap({ id: String(product.id) })) }
          },
          { provide: Location, useValue: renderLocationMock }
        ]
      });

      return { ...result, renderProductsServiceMock };
    };

    it('renders main content and headings', async () => {
      await renderComponent(createProduct({ name: 'patata' }));

      expect(screen.getByRole('heading', { name: /Detalles de patata/i })).toBeTruthy();
      expect(screen.getByText('Identificador:')).toBeTruthy();
      expect(screen.getByText('Nombre:')).toBeTruthy();
    });

    it('renders product data in the template', async () => {
      const product = createProduct({ id: 3, name: 'manzana', stock: 12 });
      await renderComponent(product);

      expect(screen.getByText('Detalles de manzana')).toBeTruthy();
      expect(screen.getByText('3')).toBeTruthy();
      expect(screen.getByText('12')).toBeTruthy();
    });

    it('shows duplicated product warning when repeatedProduct is set', async () => {
      await renderComponent(createProduct(), 'pera');

      expect(screen.getByText(/El nombre pera ya existe/i)).toBeTruthy();
    });

    it('hides duplicated product warning when repeatedProduct is empty', async () => {
      const { fixture } = await renderComponent();

      fixture.componentInstance.repeatedProduct = '';
      fixture.detectChanges();

      expect(screen.queryByText(/El nombre pera ya existe/i)).toBeNull();
    });

    it('shows feedback message after successful update', async () => {
      await renderComponent(createProduct(), undefined, {
        show: true,
        product: createProduct({ name: 'producto actualizado' })
      });

      expect(screen.getByText(/Se ha actualizado el producto: producto actualizado/i)).toBeTruthy();
    });

    it('exposes accessible inputs and labels', async () => {
      await renderComponent();

      expect(screen.getByLabelText(/Nombre:/i)).toBeTruthy();
      const form = screen.getByText('Identificador:').closest('form');
      expect(form).toBeTruthy();

      const formQueries = within(form as HTMLElement);
      expect(formQueries.getByText('Precio:')).toBeTruthy();
    });
  });
});
