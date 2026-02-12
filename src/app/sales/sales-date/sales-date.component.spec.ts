import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { SalesDateComponent } from './sales-date.component';
import { SalesService } from '../sales.service';
import { Sale } from '../sale';

// Mock SalesService
const buildSalesServiceMock = (sales: Sale[] = [], error: boolean = false) => ({
  salesByDate: vi.fn(() => error ? throwError(() => new Error('fail')) : of(sales))
});

describe('SalesDateComponent', () => {
  let salesServiceMock: ReturnType<typeof buildSalesServiceMock>;
  let defaultSales: Sale[];

  beforeEach(() => {
    defaultSales = [
      {
        id: 1,
        date: new Date(),
        creditCard: false,
        itemsSale: [
          { id: 1, quantity: 2, price: 10, product: { id: 1, name: 'Product 1', price: 10, type: '', stock: 0 } },
          { id: 2, quantity: 1, price: 5, product: { id: 2, name: 'Product 2', price: 5, type: '', stock: 0 } }
        ]
      }
    ];
    salesServiceMock = buildSalesServiceMock(defaultSales);
  });

  // Unit/Logic Tests
  it('should initialize with default state', async () => {
    await TestBed.configureTestingModule({
      imports: [SalesDateComponent],
      providers: [{ provide: SalesService, useValue: salesServiceMock }]
    }).compileComponents();
    const fixture = TestBed.createComponent(SalesDateComponent);
    const component = fixture.componentInstance;
    expect(component.sales).toEqual([]);
    expect(component.total).toBe(0);
    expect(component.loading).toBe(false);
  });

  it('should call salesService.salesByDate and update state on findSales', async () => {
    await TestBed.configureTestingModule({
      imports: [SalesDateComponent],
      providers: [{ provide: SalesService, useValue: salesServiceMock }]
    }).compileComponents();
    const fixture = TestBed.createComponent(SalesDateComponent);
    const component = fixture.componentInstance;
    component.findSales({ from: '2024-01-01', to: '2024-01-31' });
    expect(salesServiceMock.salesByDate).toHaveBeenCalled();
    expect(component.sales).toEqual(defaultSales);
    expect(component.total).toBe(25); // 2*10 + 1*5
    expect(component.loading).toBe(false);
  });

  it('should set loading to false on error in findSales', async () => {
    salesServiceMock = buildSalesServiceMock([], true);
    await TestBed.configureTestingModule({
      imports: [SalesDateComponent],
      providers: [{ provide: SalesService, useValue: salesServiceMock }]
    }).compileComponents();
    const fixture = TestBed.createComponent(SalesDateComponent);
    const component = fixture.componentInstance;
    component.findSales({ from: '2024-01-01', to: '2024-01-31' });
    expect(component.loading).toBe(false);
  });

  // Render/Template Tests
  it('renders loading spinner when loading', async () => {
    await render(SalesDateComponent, {
      componentProperties: {
        loading: true,
        sales: [],
        total: 0
      },
      providers: [{ provide: SalesService, useValue: salesServiceMock }]
    });
    expect(screen.getByLabelText('loading')).toBeTruthy();
  });

  it('renders sales list and table when not loading', async () => {
    await render(SalesDateComponent, {
      componentProperties: {
        loading: false,
        sales: defaultSales,
        total: 25
      },
      providers: [{ provide: SalesService, useValue: salesServiceMock }]
    });
    expect(screen.getByText('Id Venta:')).toBeTruthy();
    expect(screen.getByText('Producto')).toBeTruthy();
    expect(screen.getByText('Cantidad')).toBeTruthy();
    expect(screen.getByText('Precio Kg')).toBeTruthy();
    expect(screen.getByText('Total')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy(); // quantity
    expect(screen.getByText('10')).toBeTruthy(); // price
    expect(screen.getByText('20')).toBeTruthy(); // total for item
  });

  it('shows total at the bottom', async () => {
    await render(SalesDateComponent, {
      componentProperties: {
        loading: false,
        sales: defaultSales,
        total: 25
      },
      providers: [{ provide: SalesService, useValue: salesServiceMock }]
    });
    expect(screen.getByText('25')).toBeTruthy();
  });

  it('calls findSales when app-select-dates emits', async () => {
    const { fixture } = await render(SalesDateComponent, {
      providers: [{ provide: SalesService, useValue: salesServiceMock }]
    });
    const component = fixture.componentInstance;
    const spy = vi.spyOn(component, 'findSales');
    
    // Get child component instance
    const selectDatesDebugElement = fixture.debugElement.query(
      (de) => de.nativeElement.tagName === 'APP-SELECT-DATES'
    );
    
    if (selectDatesDebugElement) {
      const selectDatesComponent = selectDatesDebugElement.componentInstance;
      // Emit through the EventEmitter
      selectDatesComponent.sendDates.emit({ from: '2024-01-01', to: '2024-01-31' });
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    }
  });
});
