import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { MockProductsService } from 'src/app/test/products.service.mock';
import { ConfigureProductTest, createRoot, RootCmp, advance } from 'src/app/test/test.module';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


describe('ProductComponent', () => {

  beforeEach(async(() => {
    ConfigureProductTest();
  }));

  describe('uso funciones', () => {
    let component: ProductComponent;
    let fixture: ComponentFixture<ProductComponent>;
    
    beforeEach(() => {
      fixture = TestBed.createComponent(ProductComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.product = new Product();
    });
    it('modificar product si price mayor que 0', fakeAsync(
      inject([ProductsService], (mockProductsService: MockProductsService) => {
        component.product.price = 1;
        component.editProduct();
        tick();
        expect(mockProductsService.postEditProductSpy)
          .toHaveBeenCalledWith(component.product);
      })
    ));
    it('no modificar product si price menor que 0', fakeAsync(
      inject([ProductsService], (mockProductsService: MockProductsService) => {
        component.editProduct();
        tick();
        expect(mockProductsService.postEditProductSpy)
          .not.toHaveBeenCalled();
      })
    ));
  });

  describe('render Product', () => {

    let fixture;
    let p: Product;
    beforeEach(fakeAsync(
      inject([Router, ProductsService],
        (router: Router, mockProductsService: MockProductsService) => {
          fixture = createRoot(router, RootCmp);
          p = new Product();
          p.id = 2; p.name = 'patata';
          p.price = 2; p.stock = 3; p.type = "Patata/Verdura";
          mockProductsService.setProduct(p);
          router.navigateByUrl('/product/2');
          advance(fixture);

        }
      )))

    it('se muestra el id en la vista', () => {
      const de: DebugElement = fixture.debugElement.query(By.css('.id'));
      expect(de.nativeElement.innerHTML).toContain(p.id);
    })

    it('se muestra el name en la vista', () => {
      const de: DebugElement = fixture.debugElement.query(By.css('#name'));
      expect(de.properties.outerHTML).toContain(p.name);
    })
    it('se muestra el stock en la vista', () => {
      const de: DebugElement = fixture.debugElement.query(By.css('#stock'));
      expect(de.nativeElement.innerHTML).toContain(p.stock);
    })
    it('se muestra el name en la vista', () => {
      const de: DebugElement = fixture.debugElement.query(By.css('#price'));
      expect(de.properties.outerHTML).toContain(p.price);
    })
    it('se muestra el stock en la vista', () => {
      const de: DebugElement = fixture.debugElement.query(By.css('#type'));
      expect(de.nativeElement.innerHTML).toContain(p.type);
    })
  })

  describe('initialization', () => {
    it('retrieves the product', fakeAsync(
      inject([Router, ProductsService],
        (router: Router,
          mockProductsService: MockProductsService) => {
          const fixture = createRoot(router, RootCmp);

          router.navigateByUrl('/product/2');
          advance(fixture);

          expect(mockProductsService.getProductSpy).toHaveBeenCalledWith(2);
        })));
  });

  describe('back', () => {
    it('return to de previous location', fakeAsync(
      inject([Router, Location],
        (router: Router, location: Location) => {
          const fixture = createRoot(router, RootCmp);
          expect(location.path()).toEqual('/');
          advance(fixture);
          router.navigateByUrl('/product/2');
          advance(fixture);
          expect(location.path()).toEqual('/product/2');
          const product = fixture.debugElement.children[1].componentInstance;
          product.return();
          advance(fixture);
          expect(location.path()).toEqual('/');
        })));
  });


});
