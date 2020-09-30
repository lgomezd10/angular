import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { PurchasesComponent } from './purchases.component';
import { MockPurchasesService } from 'src/app/test/purchases.service.mock';
import { MockProductosService } from 'src/app/test/productos.service.mock';
import { MockToolsServices } from 'src/app/test/tools.service.mock';
import { toolsService } from 'src/app/tools/tools.service';
import { purchasesService } from '../purchases.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoModule } from 'src/app/producto/producto.module';
import { Boton } from 'src/app/tools/boton';
import { By } from '@angular/platform-browser';
import {
  dispatchEvent,
  ConsoleSpy
} from '../../test/utils';
import { ProductosService } from 'src/app/producto/productos.service';
import { Producto } from 'src/app/producto/producto';
import { Compra } from '../purchases';
import { error } from 'protractor';


describe('PurchasesComponent', () => {
  let component: PurchasesComponent;
  let fixture: ComponentFixture<PurchasesComponent>;


  beforeEach(async(() => {
    const mockProductosService: MockProductosService = new MockProductosService();
    const mocktoolsServices: MockToolsServices = new MockToolsServices();
    const mockPurchasesService: MockPurchasesService = new MockPurchasesService();
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ProductoModule],
      declarations: [PurchasesComponent],
      providers: [
        mockProductosService.getProviders(),
        { provide: toolsService, useValue: mocktoolsServices },
        { provide: purchasesService, useValue: mockPurchasesService }
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

  describe('mostrar elementos', () => {
    it('No mostrar formulario para añadir Producto', () => {

      expect(fixture.debugElement.query(By.css('form'))).toBeNull();
    });

    it('Mostrar formulario para añadir producto', () => {
      component.mostrarBoton("AddProducto");
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('form'))).not.toBeNull();
    });
    
    it('No mostrar formulario para crear producto', () => {      
      expect(fixture.debugElement.query(By.css('app-nuevo'))).toBeNull();
    });

    it('Mostrar formulario para crear producto', () => {
      component.mostrarBoton("CrearProducto");
      fixture.detectChanges();      
      expect(fixture.debugElement.query(By.css('app-nuevo'))).not.toBeNull();
    });
  });

  describe('funciones', () => {
    it('guardar compra correcta', fakeAsync(inject([purchasesService],
      (mockpurchasesService: MockPurchasesService) => {
        component.purchases.push(new Compra());
        component.mostrarBoton('EnviarCompra');
        expect(mockpurchasesService.guardarpurchasespy).toHaveBeenCalled();
      })));

    it('guardar compra incorrecta', fakeAsync(inject([purchasesService],
      (mockpurchasesService: MockPurchasesService) => {
        component.mostrarBoton('EnviarCompra');
        expect(mockpurchasesService.guardarpurchasespy).not.toHaveBeenCalled();
      })));      
  });

  describe('formulario', () => {
    let producto, quantity, price, el;
    beforeEach(fakeAsync(inject([ProductosService],
      (mockProductosService: MockProductosService) => {
        let p1 = new Producto();
        p1.name = 'producto1';
        let p2 = new Producto();
        p2.name = 'producto2';
        mockProductosService.setProductos([p1, p2]);
        tick();
        component.mostrarBoton("AddProducto");
        fixture.detectChanges();
        el = fixture.debugElement.nativeElement;
        producto = fixture.debugElement.query(By.css('#producto')).nativeElement;
        quantity = fixture.debugElement.query(By.css('#quantity')).nativeElement;
        price = fixture.debugElement.query(By.css('#price')).nativeElement;
        fixture.detectChanges();
      })));

    
    describe('formulario con valores correctos', () => {

      beforeEach(() => {
        producto.options[0].selected = true;
        dispatchEvent(producto, 'change');
        quantity.value = 1;
        dispatchEvent(quantity, 'input');
        price.value = 1;
        dispatchEvent(price, 'input');
        fixture.detectChanges();
      });

      describe('campos de formulario', () => {

        afterAll(() => {
          component.formulario.reset();
        });

        it('campo producto', () => {
          expect(component.formulario.controls['producto'].value.name).toBe('producto1');
        });
        it('campo quantity', () => {
          expect(component.formulario.controls['quantity'].value).toBe(1);
        });

        it('campo price', () => {
          expect(component.formulario.controls['price'].value).toBe(1);
        });

      });

      it('No lanza errores', () => {
        
        expect(component.formulario.valid).toBeTruthy();

        component.formulario.markAllAsTouched();        
        fixture.detectChanges(); 
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs.length).toBe(0);
      });

      it('Enviar formulario', () => {
        component.formulario.markAllAsTouched();
        fixture.detectChanges();
        component.mostrarBoton("Add");
        expect(component.purchases.length).toBe(1);
      });
    });

    describe('Errores en formulario', () => {

      it('Errores en campo producto', () => {
       

        component.formulario.controls['producto'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('Seleccione un producto');
      });

      it('Errores en campo quantity', () => {

        
        
        component.formulario.controls['quantity'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('Introduzca la quantity');
      });

      it('Errores quantity menor que 0.1', () => {
        // Otra forma de controlar los errores
        let fquantity = component.formulario.controls['quantity'];
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
        component.formulario.controls['quantity'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('La quantity debe ser mayor que 0');
      });

      it('Error price invalido', () => {
        
        component.formulario.controls['price'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('Introduzca el price');
      });

      it('Error price menor que 0,1', () => {
        price.value = 0;
        dispatchEvent(price, 'input');
        component.formulario.controls['price'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('El price debe ser mayor que 0');
      });

      it('Enviar formulario no válido', () => {
        component.mostrarBoton("Add");
        expect(expect(component.purchases.length).toBe(0));
        component.formulario.markAllAsTouched();
        component.mostrarBoton("Add");
        expect(expect(component.purchases.length).toBe(0));
      });
    });

  })


});
