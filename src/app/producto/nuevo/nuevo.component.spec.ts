import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { NuevoComponent } from './nuevo.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  dispatchEvent,
  ConsoleSpy
} from '../../test/utils';
import { By } from '@angular/platform-browser';
import { MockProductosService } from 'src/app/test/productos.service.mock';
import { ProductosService } from '../productos.service';
import { Producto } from '../producto';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HerramientasService } from 'src/app/herramientas/herramientas.service';
import { MockHerramientasServices } from 'src/app/test/herramientas.service.mock';
import { CommonModule } from '@angular/common';
import { ProductoModule } from '../producto.module';

describe('NuevoComponent', () => {
  let componet: NuevoComponent;
  let fixture: ComponentFixture<NuevoComponent>;
  beforeEach(async(() => {

    const mockProductosService: MockProductosService = new MockProductosService();
    const mockHerramientasServices: MockHerramientasServices = new MockHerramientasServices();
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ProductoModule],
      providers: [
        mockProductosService.getProviders(),
        { provide: HerramientasService, useValue: mockHerramientasServices }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [NuevoComponent]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoComponent);
    componet = fixture.componentInstance;
  });

  it('should create', () => {
    expect(componet).toBeTruthy();
  });

  describe('formulario', () => {
    let nombre, tipo, precio, el;
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      el = fixture.debugElement.nativeElement;
      nombre = fixture.debugElement.query(By.css('#nombre')).nativeElement;
      tipo = fixture.debugElement.query(By.css('#tipo')).nativeElement;
      precio = fixture.debugElement.query(By.css('#precio')).nativeElement;
      fixture.detectChanges();
    }));

    //afterAll(() => (<any>window).console = originalConsole);
    describe('valores de campos', () => {

      beforeEach(fakeAsync(() => {
        nombre.value = 'producto1';
        dispatchEvent(nombre, 'input');
        tipo.options[6].selected = true;
        dispatchEvent(tipo, 'change');
        precio.value = 1;
        dispatchEvent(precio, 'input');
        fixture.detectChanges();
        
      }));

      afterAll(() => {
        componet.formulario.reset();
      })

      it('campo nombre', () => {
        expect(componet.formulario.controls['nombre'].value).toBe('producto1');
      });
      it('campo tipo', () => {
        expect(componet.formulario.controls['tipo'].value).toBe("Otros/Verdura");
      });

      it('campo precio', () => {
        expect(componet.formulario.controls['precio'].value).toBe(1);
      });

      it('No lanza errores',fakeAsync(() => { 
        componet.formulario.markAllAsTouched();     
        fixture.detectChanges();  
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs.length).toBe(0);
      }))

    });

    describe('Errores en formulario', () => {

      afterEach(() => componet.formulario.reset());

      it('Errores en campo nombre', fakeAsync(() => {
        nombre.value = '';
        dispatchEvent(nombre, 'input');
        componet.formulario.controls['nombre'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs[0].innerHTML).toContain('Falta el nombre del producto');
      }));

      it('Errores en campo tipo', fakeAsync(() => {
        tipo.value = '';
        dispatchEvent(tipo, 'input');
        componet.formulario.controls['tipo'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs[0].innerHTML).toContain('Seleccione un tipo');
      }));

      it('Error precio invalido', fakeAsync(() => {
        precio.value = '';
        dispatchEvent(precio, 'input');
        componet.formulario.controls['precio'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs[0].innerHTML).toContain('Introduzca el precio');        
      }));

      it('Error precio menor que 0,1', fakeAsync(() => {
        precio.value = 0;
        dispatchEvent(precio, 'input');
        componet.formulario.controls['precio'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();     
        expect(msgs[0].innerHTML).toContain('El precio debe ser mayor que 0');        
      }));
    });

  })

});
