import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasFechaComponent } from './compras-fecha.component';

describe('ComprasFechaComponent', () => {
  let component: ComprasFechaComponent;
  let fixture: ComponentFixture<ComprasFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
