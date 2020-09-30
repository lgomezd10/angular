import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ProductosComponent } from './productos.component';
import { MockProductosService } from 'src/app/test/productos.service.mock';
import { ProductosService } from '../productos.service';
import { ActivatedRoute } from '@angular/router';
import { FilterPipe } from '../filter.pipe';
import { SortPipe } from '../sort.pipe';
import { ProductoPipe } from '../producto.pipe';
import { Producto } from '../producto';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class MockActivatedRoute {

}
describe('ProductosComponent', () => {
  let component: ProductosComponent;
  let fixture: ComponentFixture<ProductosComponent>;

  beforeEach(async(() => {
    const mockProductosService: MockProductosService = new MockProductosService();
    TestBed.configureTestingModule({
      declarations: [ProductosComponent, FilterPipe, SortPipe, ProductoPipe],
      providers: [
        //{provide: ProductosService, useValue: mockProductosService},
        mockProductosService.getProviders(),
        { provide: ActivatedRoute, useValue: MockActivatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
      //TestBed.configureTestingModule({
      //  declarations: [ ProductosComponent ]
      //})
      //.compileComponents();
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('cargar productos', fakeAsync(
    inject([ProductosService, ActivatedRoute], (mockProductosService: MockProductosService, r) => {
      console.log("prueba");
      var productos;
      const producto1 = new Producto();
      producto1.nombre = "pera";
      const producto2 = new Producto();
      producto2.nombre = "platano";
      mockProductosService.setProductos([producto1, producto2]);      
      component.productos$.subscribe(p => {
        productos = p;        
      });
      tick();
      expect(productos).toEqual([producto1, producto2]);

    })));

    it('sin cargar productos', fakeAsync(
      inject([ProductosService, ActivatedRoute], (mockProductosService: MockProductosService, r) => {
        console.log("prueba");
        var productos;
        const producto1 = new Producto();
        producto1.nombre = "pera";
        const producto2 = new Producto();
        producto2.nombre = "platano";
        //mockProductosService.setProductos([producto1, producto2]);      
        component.productos$.subscribe(p => {
          productos = p;        
        });
        tick();
        expect(productos).toEqual([]);
  
      })));
});
