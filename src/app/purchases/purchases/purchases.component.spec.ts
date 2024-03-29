import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { PurchasesComponent } from './purchases.component';
import { MockPurchasesService } from 'src/app/test/purchases.service.mock';
import { MockProductsService } from 'src/app/test/products.service.mock';
import { MockToolsServices } from 'src/app/test/tools.service.mock';
import { ToolsService } from 'src/app/tools/tools.service';
import { PurchasesService } from '../purchases.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductModule } from 'src/app/product/product.module';
import { ButtonType } from 'src/app/tools/button-type';
import { By } from '@angular/platform-browser';
import {
  dispatchEvent,
  ConsoleSpy
} from '../../test/utils';
import { ProductsService } from 'src/app/product/products.service';
import { Product } from 'src/app/product/product';
import { Purchase } from '../purchase';
import { error } from 'protractor';


describe('PurchasesComponent', () => {
  let component: PurchasesComponent;
  let fixture: ComponentFixture<PurchasesComponent>;


  beforeEach(async(() => {
    const mockProductsService: MockProductsService = new MockProductsService();
    const mocktoolsServices: MockToolsServices = new MockToolsServices();
    const mockPurchasesService: MockPurchasesService = new MockPurchasesService();
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ProductModule],
      declarations: [PurchasesComponent],
      providers: [
        mockProductsService.getProviders(),
        { provide: ToolsService, useValue: mocktoolsServices },
        { provide: PurchasesService, useValue: mockPurchasesService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('show elementos', () => {
    it('No show formGroup para añadir Product', () => {

      expect(fixture.debugElement.query(By.css('form'))).toBeNull();
    });

    it('Mostrar formGroup para añadir product', () => {
      component.showButtonType("AddProduct");
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('form'))).not.toBeNull();
    });
    
    it('No show formGroup para crear product', () => {      
      expect(fixture.debugElement.query(By.css('app-new'))).toBeNull();
    });

    it('Mostrar formGroup para crear product', () => {
      component.showButtonType("CrearProduct");
      fixture.detectChanges();      
      expect(fixture.debugElement.query(By.css('app-new'))).not.toBeNull();
    });
  });

  describe('funciones', () => {
    it('guardar compra correcta', fakeAsync(inject([PurchasesService],
      (mockpurchasesService: MockPurchasesService) => {
        component.purchases.push(new Purchase());
        component.showButtonType('EnviarPurchase');
        expect(mockpurchasesService.guardarpurchasespy).toHaveBeenCalled();
      })));

    it('guardar compra incorrecta', fakeAsync(inject([PurchasesService],
      (mockpurchasesService: MockPurchasesService) => {
        component.showButtonType('EnviarPurchase');
        expect(mockpurchasesService.guardarpurchasespy).not.toHaveBeenCalled();
      })));      
  });

  describe('formGroup', () => {
    let product, quantity, price, el;
    beforeEach(fakeAsync(inject([ProductsService],
      (mockProductsService: MockProductsService) => {
        let p1 = new Product();
        p1.name = 'product1';
        let p2 = new Product();
        p2.name = 'product2';
        mockProductsService.setProducts([p1, p2]);
        tick();
        component.showButtonType("AddProduct");
        fixture.detectChanges();
        el = fixture.debugElement.nativeElement;
        product = fixture.debugElement.query(By.css('#product')).nativeElement;
        quantity = fixture.debugElement.query(By.css('#quantity')).nativeElement;
        price = fixture.debugElement.query(By.css('#price')).nativeElement;
        fixture.detectChanges();
      })));

    
    describe('formGroup con valores correctos', () => {

      beforeEach(() => {
        product.options[0].selected = true;
        dispatchEvent(product, 'change');
        quantity.value = 1;
        dispatchEvent(quantity, 'input');
        price.value = 1;
        dispatchEvent(price, 'input');
        fixture.detectChanges();
      });

      describe('campos de formGroup', () => {

        afterAll(() => {
          component.formGroup.reset();
        });

        it('campo product', () => {
          expect(component.formGroup.controls['product'].value.name).toBe('product1');
        });
        it('campo quantity', () => {
          expect(component.formGroup.controls['quantity'].value).toBe(1);
        });

        it('campo price', () => {
          expect(component.formGroup.controls['price'].value).toBe(1);
        });

      });

      it('No lanza errores', () => {
        
        expect(component.formGroup.valid).toBeTruthy();

        component.formGroup.markAllAsTouched();        
        fixture.detectChanges(); 
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs.length).toBe(0);
      });

      it('Enviar formGroup', () => {
        component.formGroup.markAllAsTouched();
        fixture.detectChanges();
        component.showButtonType("Add");
        expect(component.purchases.length).toBe(1);
      });
    });

    describe('Errores en formGroup', () => {

      it('Errores en campo product', () => {
       

        component.formGroup.controls['product'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('Seleccione un product');
      });

      it('Errores en campo quantity', () => {

        
        
        component.formGroup.controls['quantity'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('Introduzca la quantity');
      });

      it('Errores quantity menor que 0.1', () => {
        // Otra forma de controlar los errores
        let fquantity = component.formGroup.controls['quantity'];
        let errors = {};
        errors = fquantity.errors || {};        
        expect(errors['required']).toBeTruthy();
        fquantity.setValue(0);
        errors = fquantity.errors || {};
        console.log("Errores", errors);
        expect(errors['min']).toBeTruthy();
        expect(errors['required']).toBeFalsy();
        
        //////////////////////////////////////////
        quantity.value = 0;
        dispatchEvent(quantity, 'input');
        component.formGroup.controls['quantity'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('La quantity debe ser mayor que 0');
      });

      it('Error price invalido', () => {
        
        component.formGroup.controls['price'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('Introduzca el price');
      });

      it('Error price menor que 0,1', () => {
        price.value = 0;
        dispatchEvent(price, 'input');
        component.formGroup.controls['price'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('El price debe ser mayor que 0');
      });

      it('Enviar formGroup no válido', () => {
        component.showButtonType("Add");
        expect(expect(component.purchases.length).toBe(0));
        component.formGroup.markAllAsTouched();
        component.showButtonType("Add");
        expect(expect(component.purchases.length).toBe(0));
      });
    });

  })


});
