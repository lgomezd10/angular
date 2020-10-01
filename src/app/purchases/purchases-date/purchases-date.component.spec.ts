import { async, ComponentFixture, fakeAsync, TestBed, inject, tick } from '@angular/core/testing';

import { PurchasesDateComponent } from './purchases-date.component';
import { PurchasesService } from '../purchases.service';
import { Purchase } from '../purchases';
import { DatePipe } from '@angular/common';
import { GroupBydatePipe } from 'src/app/tools/group-by.date.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


export class MockPurchasesService {

  purchases: Purchase[];

  constructor() {

    this.purchases = [{ id: 1, product: null, quantity: 2, price: 3, date: new Date() }]
  }

  purchasesByDate(from, to): any {    
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
        { provide: PurchasesService, useValue: MockPurchasesService }
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

  it('findPurchases', fakeAsync(inject([PurchasesService], (mockPurchasesService: MockPurchasesService) => {
    let compra;
    component.findPurchases({ from: "date1", to: "date2" });
    tick();
    expect(component.purchases[0].id).toBe(1);
  })))

});
