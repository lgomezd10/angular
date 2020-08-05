import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { ProductoComponent } from './producto.component';
import { MockProductosService } from 'src/app/test/productos.service.mock';
import { ConfigureProductoTest, createRoot, RootCmp, advance } from 'src/app/test/test.module';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductosService } from '../productos.service';
import { Producto } from '../producto';


describe('ProductoComponent', () => {
  
  beforeEach(async(() => {
    ConfigureProductoTest();
  }));

  describe('uso funciones', () => {
    let component: ProductoComponent;
    let fixture: ComponentFixture<ProductoComponent>;
    /*beforeEach(fakeAsync(
      inject([Router, ProductosService], 
        (router: Router, mockProductosService: MockProductosService) => {
          const fixture = createRoot(router, RootCmp);        
        router.navigateByUrl('/producto/2');
        advance(fixture);
        producto = fixture.debugElement.children[1].componentInstance;
        })
    ))*/
    beforeEach(() => {
      fixture = TestBed.createComponent(ProductoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.producto = new Producto();      
    });
    it('modificar producto precio mayor que 0', fakeAsync(
      inject([ProductosService], (mockProductosService: MockProductosService) => {
        component.producto.precio = 1;
        component.modificarProducto();
        tick();
        expect(mockProductosService.postModificarProductoSpy)
        .toHaveBeenCalledWith(component.producto);
      })
    ));
    it('modificar producto precio menor que 0', fakeAsync(
      inject([ProductosService], (mockProductosService: MockProductosService) => {
        component.modificarProducto();
        tick();
        expect(mockProductosService.postModificarProductoSpy)
        .not.toHaveBeenCalled();
      })
    ));
  });
 
  describe('initialization', () => {
    it('retrieves the product', fakeAsync(
      inject([Router, ProductosService],
             (router: Router,
              mockProductosService: MockProductosService) => {
        const fixture = createRoot(router, RootCmp);

        router.navigateByUrl('/producto/2');
        advance(fixture);

        expect(mockProductosService.getProductoSpy).toHaveBeenCalledWith(2);
      })));
  });

  describe('back', () => {
    it('return to de previous location', fakeAsync(
      inject([Router, Location],
        (router: Router, location: Location) => {
        const fixture = createRoot(router, RootCmp);
        expect(location.path()).toEqual('/');
        advance(fixture);
        router.navigateByUrl('/producto/2');
        advance(fixture);
        expect(location.path()).toEqual('/producto/2');
        const producto = fixture.debugElement.children[1].componentInstance;
        producto.volver();
        advance(fixture);
        expect(location.path()).toEqual('/');
      })));
  });



  
  
});
