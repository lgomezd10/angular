import { async, ComponentFixture, fakeAsync, TestBed, inject, tick } from '@angular/core/testing';

import { PurchasesDateComponent } from './purchases-date.component';
import { purchasesService } from '../purchases.service';
import { Compra } from '../purchases';
import { DatePipe } from '@angular/common';
import { GroupBydatePipe } from 'src/app/tools/group-by.date.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


export class MockPurchasesService {

  purchases: Compra[];

  constructor() {

    this.purchases = [{ purchaseId: 1, producto: null, quantity: 2, price: 3, date: new Date() }]
  }

  purchasesPordates(desde, hasta): any {    
    return this;
  }

  subscribe(callback) {
    callback(this.purchases);
  }

}

describe('PurchasesDateComponent', () => {
  let component: PurchasesDateComponent;
  let fixture: ComponentFixture<PurchasesDateComponent>;

  beforeEach(async(() => {
    const mockPurchasesService: MockPurchasesService = new MockPurchasesService();
    TestBed.configureTestingModule({
      declarations: [PurchasesDateComponent, DatePipe, GroupBydatePipe],
      providers: [
        { provide: purchasesService, useValue: MockPurchasesService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('buscarpurchases', fakeAsync(inject([purchasesService], (mockPurchasesService: MockPurchasesService) => {
    let compra;
    component.buscarPurchases({ desde: "date1", hasta: "date2" });
    tick();
    expect(component.purchases[0].purchaseId).toBe(1);
  })))

});
