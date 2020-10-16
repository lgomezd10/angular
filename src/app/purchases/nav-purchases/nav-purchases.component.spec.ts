import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPurchasesComponent } from './nav-purchases.component';

describe('NavPurchasesComponent', () => {
  let component: NavPurchasesComponent;
  let fixture: ComponentFixture<NavPurchasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavPurchasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
