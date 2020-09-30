import { async, ComponentFixture, fakeAsync, TestBed, inject, tick } from '@angular/core/testing';

import { ComprasFechaComponent } from './compras-fecha.component';
import { ComprasService } from '../compras.service';
import { Compra } from '../compra';
import { DatePipe } from '@angular/common';
import { GroupByFechaPipe } from 'src/app/herramientas/group-by.fecha.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


export class MockComprasService {

  compras: Compra[];

  constructor() {

    this.compras = [{ id_compra: 1, producto: null, cantidad: 2, precio: 3, fecha: new Date() }]
  }

  comprasPorFechas(desde, hasta): any {    
    return this;
  }

  subscribe(callback) {
    callback(this.compras);
  }

}

describe('ComprasFechaComponent', () => {
  let component: ComprasFechaComponent;
  let fixture: ComponentFixture<ComprasFechaComponent>;

  beforeEach(async(() => {
    const mockComprasService: MockComprasService = new MockComprasService();
    TestBed.configureTestingModule({
      declarations: [ComprasFechaComponent, DatePipe, GroupByFechaPipe],
      providers: [
        { provide: ComprasService, useValue: mockComprasService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  it('buscarCompras', fakeAsync(inject([ComprasService], (mockComprasService: MockComprasService) => {
    let compra;
    component.buscarCompras({ desde: "fecha1", hasta: "fecha2" });
    tick();
    expect(component.compras[0].id_compra).toBe(1);
  })))

});
