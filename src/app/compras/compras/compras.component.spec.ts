import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { ComprasComponent } from './compras.component';
import { MockComprasService } from 'src/app/test/compras.service.mock';
import { MockProductosService } from 'src/app/test/productos.service.mock';
import { MockHerramientasServices } from 'src/app/test/herramientas.service.mock';
import { HerramientasService } from 'src/app/herramientas/herramientas.service';
import { ComprasService } from '../compras.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoModule } from 'src/app/producto/producto.module';
import { Boton } from 'src/app/herramientas/boton';
import { By } from '@angular/platform-browser';
import {
  dispatchEvent,
  ConsoleSpy
} from '../../test/utils';
import { ProductosService } from 'src/app/producto/productos.service';
import { Producto } from 'src/app/producto/producto';
import { Compra } from '../compra';
import { error } from 'protractor';


describe('ComprasComponent', () => {
  let component: ComprasComponent;
  let fixture: ComponentFixture<ComprasComponent>;


  beforeEach(async(() => {
    const mockProductosService: MockProductosService = new MockProductosService();
    const mockHerramientasServices: MockHerramientasServices = new MockHerramientasServices();
    const mockComprasService: MockComprasService = new MockComprasService();
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ProductoModule],
      declarations: [ComprasComponent],
      providers: [
        mockProductosService.getProviders(),
        { provide: HerramientasService, useValue: mockHerramientasServices },
        { provide: ComprasService, useValue: mockComprasService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasComponent);
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
    it('guardar compra correcta', fakeAsync(inject([ComprasService],
      (mockComprasService: MockComprasService) => {
        component.compras.push(new Compra());
        component.mostrarBoton('EnviarCompra');
        expect(mockComprasService.guardarCompraSpy).toHaveBeenCalled();
      })));

    it('guardar compra incorrecta', fakeAsync(inject([ComprasService],
      (mockComprasService: MockComprasService) => {
        component.mostrarBoton('EnviarCompra');
        expect(mockComprasService.guardarCompraSpy).not.toHaveBeenCalled();
      })));      
  });

  describe('formulario', () => {
    let producto, cantidad, precio, el;
    beforeEach(fakeAsync(inject([ProductosService],
      (mockProductosService: MockProductosService) => {
        let p1 = new Producto();
        p1.nombre = 'producto1';
        let p2 = new Producto();
        p2.nombre = 'producto2';
        mockProductosService.setProductos([p1, p2]);
        tick();
        component.mostrarBoton("AddProducto");
        fixture.detectChanges();
        el = fixture.debugElement.nativeElement;
        producto = fixture.debugElement.query(By.css('#producto')).nativeElement;
        cantidad = fixture.debugElement.query(By.css('#cantidad')).nativeElement;
        precio = fixture.debugElement.query(By.css('#precio')).nativeElement;
        fixture.detectChanges();
      })));

    
    describe('formulario con valores correctos', () => {

      beforeEach(() => {
        producto.options[0].selected = true;
        dispatchEvent(producto, 'change');
        cantidad.value = 1;
        dispatchEvent(cantidad, 'input');
        precio.value = 1;
        dispatchEvent(precio, 'input');
        fixture.detectChanges();
      });

      describe('campos de formulario', () => {

        afterAll(() => {
          component.formulario.reset();
        });

        it('campo producto', () => {
          expect(component.formulario.controls['producto'].value.nombre).toBe('producto1');
        });
        it('campo cantidad', () => {
          expect(component.formulario.controls['cantidad'].value).toBe(1);
        });

        it('campo precio', () => {
          expect(component.formulario.controls['precio'].value).toBe(1);
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
        expect(component.compras.length).toBe(1);
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

      it('Errores en campo cantidad', () => {

        
        
        component.formulario.controls['cantidad'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('Introduzca la cantidad');
      });

      it('Errores cantidad menor que 0.1', () => {
        // Otra forma de controlar los errores
        let fcantidad = component.formulario.controls['cantidad'];
        let errors = {};
        errors = fcantidad.errors || {};        
        expect(errors['required']).toBeTruthy();
        fcantidad.setValue(0);
        errors = fcantidad.errors || {};
        console.log("Errores", errors);
        expect(errors['min']).toBeTruthy();
        expect(errors['required']).toBeFalsy();
        
        //////////////////////////////////////////
        cantidad.value = 0;
        dispatchEvent(cantidad, 'input');
        component.formulario.controls['cantidad'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('La cantidad debe ser mayor que 0');
      });

      it('Error precio invalido', () => {
        
        component.formulario.controls['precio'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('Introduzca el precio');
      });

      it('Error precio menor que 0,1', () => {
        precio.value = 0;
        dispatchEvent(precio, 'input');
        component.formulario.controls['precio'].markAsTouched();
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();
        expect(msgs[0].innerHTML).toContain('El precio debe ser mayor que 0');
      });

      it('Enviar formulario no válido', () => {
        component.mostrarBoton("Add");
        expect(expect(component.compras.length).toBe(0));
        component.formulario.markAllAsTouched();
        component.mostrarBoton("Add");
        expect(expect(component.compras.length).toBe(0));
      });
    });

  })


});
