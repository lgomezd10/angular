import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSalesComponent } from './nav-sales.component';

describe('NavSalesComponent', () => {
  let component: NavSalesComponent;
  let fixture: ComponentFixture<NavSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
