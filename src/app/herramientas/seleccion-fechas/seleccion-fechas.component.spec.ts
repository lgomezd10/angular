import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionFechasComponent } from './seleccion-fechas.component';

describe('SeleccionFechasComponent', () => {
  let component: SeleccionFechasComponent;
  let fixture: ComponentFixture<SeleccionFechasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionFechasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
