import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { ProductoComponent } from './producto.component';
import { MockProductosService } from 'src/app/test/productos.service.mock';
import { ConfigureProductoTest, createRoot, RootCmp, advance } from 'src/app/test/test.module';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductosService } from '../productos.service';
import { Producto } from '../producto';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


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
    it('modificar producto si precio mayor que 0', fakeAsync(
      inject([ProductosService], (mockProductosService: MockProductosService) => {
        component.producto.precio = 1;
        component.modificarProducto();
        tick();
        expect(mockProductosService.postModificarProductoSpy)
          .toHaveBeenCalledWith(component.producto);
      })
    ));
    it('no modificar producto si precio menor que 0', fakeAsync(
      inject([ProductosService], (mockProductosService: MockProductosService) => {
        component.modificarProducto();
        tick();
        expect(mockProductosService.postModificarProductoSpy)
          .not.toHaveBeenCalled();
      })
    ));
  });

  describe('render Product', () => {

    let fixture;
    let p: Producto;
    beforeEach(fakeAsync(
      inject([Router, ProductosService],
        (router: Router, mockProductosService: MockProductosService) => {
          fixture = createRoot(router, RootCmp);
          p = new Producto();
          p.id_producto = 2; p.nombre = 'patata';
          p.precio = 2; p.stock = 3; p.tipo = "Patata/Verdura";
          mockProductosService.setProducto(p);
          router.navigateByUrl('/producto/2');
          advance(fixture);

        }
      )))

    it('se muestra el id en la vista', () => {
      const de: DebugElement = fixture.debugElement.query(By.css('.id_producto'));
      expect(de.nativeElement.innerHTML).toContain(p.id_producto);
    })

    it('se muestra el nombre en la vista', () => {
      const de: DebugElement = fixture.debugElement.query(By.css('#nombre'));
      expect(de.properties.outerHTML).toContain(p.nombre);
    })
    it('se muestra el stock en la vista', () => {
      const de: DebugElement = fixture.debugElement.query(By.css('#stock'));
      expect(de.nativeElement.innerHTML).toContain(p.stock);
    })
    it('se muestra el nombre en la vista', () => {
      const de: DebugElement = fixture.debugElement.query(By.css('#precio'));
      expect(de.properties.outerHTML).toContain(p.precio);
    })
    it('se muestra el stock en la vista', () => {
      const de: DebugElement = fixture.debugElement.query(By.css('#tipo'));
      expect(de.nativeElement.innerHTML).toContain(p.tipo);
    })
  })

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
