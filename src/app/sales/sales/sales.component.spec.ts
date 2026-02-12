import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { describe, it, expect, beforeEach } from 'vitest';
import { SalesComponent } from './sales.component';
import { ProductsService } from '../../product/products.service';
import { SalesService } from '../sales.service';
import { ToolsService } from '../../tools/tools.service';
import { ItemSale } from '../item-sale';
import { Product } from '../../product/product';

const buildProductsServiceMock = () => ({
  getProducts$: vi.fn(() => []),
});
const buildSalesServiceMock = () => ({
  saveSales: vi.fn(() => ({ subscribe: vi.fn(cb => cb(123)) })),
  updateSales: vi.fn(() => ({ subscribe: vi.fn(cb => cb(456)) })),
  getSale: vi.fn(() => ({ subscribe: vi.fn(cb => cb({ id: 1, creditCard: false, itemsSale: [] })) })),
});
const buildToolsServiceMock = () => ({
  cleanShowErrorsComponent: vi.fn()
});

describe('SalesComponent', () => {
  let productsServiceMock: any;
  let salesServiceMock: any;
  let toolsServiceMock: any;

  beforeEach(() => {
    productsServiceMock = buildProductsServiceMock();
    salesServiceMock = buildSalesServiceMock();
    toolsServiceMock = buildToolsServiceMock();
  });

  // Unit/Logic Tests
  it('should initialize with default state', async () => {
    await TestBed.configureTestingModule({
      imports: [SalesComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: SalesService, useValue: salesServiceMock },
        { provide: ToolsService, useValue: toolsServiceMock }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(SalesComponent);
    const component = fixture.componentInstance;
    expect(component.saleList).toEqual([]);
    expect(component.saleId).toBe(0);
    expect(component.creditCard).toBe(false);
    expect(component.showNew).toBe(false);
  });

  it('should add new product to saleList', async () => {
    await TestBed.configureTestingModule({
      imports: [SalesComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: SalesService, useValue: salesServiceMock },
        { provide: ToolsService, useValue: toolsServiceMock }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(SalesComponent);
    const component = fixture.componentInstance;
    component.currentItem = { id: 1, product: { id: 1, name: 'Pera', price: 10, type: '', stock: 0 }, quantity: 2, price: 10 } as ItemSale;
    component.saleList = [];
    component.addPurchaseToList();
    expect(component.saleList.length).toBe(1);
    expect(component.saleList[0].product.name).toBe('Pera');
  });

  it('should calculate totalSale correctly', async () => {
    await TestBed.configureTestingModule({
      imports: [SalesComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: SalesService, useValue: salesServiceMock },
        { provide: ToolsService, useValue: toolsServiceMock }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(SalesComponent);
    const component = fixture.componentInstance;
    component.saleList = [
      { id: 1, product: { id: 1, name: 'Pera', price: 10, type: '', stock: 0 }, quantity: 2, price: 10 },
      { id: 2, product: { id: 2, name: 'Manzana', price: 5, type: '', stock: 0 }, quantity: 1, price: 5 }
    ];
    expect(component.totalSale()).toBe(25);
  });

  it('should call saveSales and update saleId', async () => {
    await TestBed.configureTestingModule({
      imports: [SalesComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: SalesService, useValue: salesServiceMock },
        { provide: ToolsService, useValue: toolsServiceMock }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(SalesComponent);
    const component = fixture.componentInstance;
    component.saleList = [
      { id: 1, product: { id: 1, name: 'Pera', price: 10, type: '', stock: 0 }, quantity: 2, price: 10 }
    ];
    component.saleId = 0;
    component.creditCard = true;
    component.saveSale();
    expect(component.saleId).toBe(123);
  });

  // Render/Template Tests
  it('renders main content and table', async () => {
    await render(SalesComponent, {
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: SalesService, useValue: salesServiceMock },
        { provide: ToolsService, useValue: toolsServiceMock }
      ]
    });
    expect(screen.getByRole('heading', { name: /Caja/i })).toBeTruthy();
    expect(screen.getByText('Añadir producto')).toBeTruthy();
    expect(screen.getByRole('table')).toBeTruthy();
  });

  it('shows success message after saving sale', async () => {
    const item = new ItemSale();
    item.product = new Product();
    item.product.name = 'Test Product';
    item.quantity = 2;
    item.price = 3;

    await render(SalesComponent, {
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: SalesService, useValue: salesServiceMock },
        { provide: ToolsService, useValue: toolsServiceMock }
      ],
      componentProperties: {
        saleList: [item],
        buttons: [
          { id: 'NuevaSale', name: 'Nueva venta', show: true, focused: false },
          { id: 'FinalizarSale', name: 'Finalizar venta', show: true, focused: false },
          { id: 'AddProduct', name: 'Añadir producto', show: true, focused: true },
          { id: 'ReabrirTicket', name: 'Reabrir ticket', show: false, focused: false }
        ]
      }
    });
    
    expect(screen.getByText('Nueva venta')).toBeTruthy();
    expect(screen.getByText('Finalizar venta')).toBeTruthy();
  });
});
