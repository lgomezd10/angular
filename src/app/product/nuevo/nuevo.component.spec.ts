import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { NuevoComponent } from './nuevo.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  dispatchEvent,
  ConsoleSpy
} from '../../test/utils';
import { By } from '@angular/platform-browser';
import { MockProductosService } from 'src/app/test/products.service.mock';
import { ProductosService } from '../products.service';
import { Producto } from '../product';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { toolsService } from 'src/app/tools/tools.service';
import { MocktoolsServices } from 'src/app/test/tools.service.mock';
import { CommonModule } from '@angular/common';
import { ProductoModule } from '../product.module';

describe('NuevoComponent', () => {
  let componet: NuevoComponent;
  let fixture: ComponentFixture<NuevoComponent>;
  beforeEach(async(() => {

    const mockProductosService: MockProductosService = new MockProductosService();
    const mocktoolsServices: MocktoolsServices = new MocktoolsServices();
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ProductoModule],
      providers: [
        mockProductosService.getProviders(),
        { provide: toolsService, useValue: mocktoolsServices }
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
    let name, type, price, el;
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      el = fixture.debugElement.nativeElement;
      name = fixture.debugElement.query(By.css('#name')).nativeElement;
      type = fixture.debugElement.query(By.css('#type')).nativeElement;
      price = fixture.debugElement.query(By.css('#price')).nativeElement;
      fixture.detectChanges();
    }));

    //afterAll(() => (<any>window).console = originalConsole);
    describe('valores de campos', () => {

      beforeEach(fakeAsync(() => {
        name.value = 'producto1';
        dispatchEvent(name, 'input');
        type.options[6].selected = true;
        dispatchEvent(type, 'change');
        price.value = 1;
        dispatchEvent(price, 'input');
        fixture.detectChanges();
        
      }));

      afterAll(() => {
        componet.formulario.reset();
      })

      it('campo name', () => {
        expect(componet.formulario.controls['name'].value).toBe('producto1');
      });
      it('campo type', () => {
        expect(componet.formulario.controls['type'].value).toBe("Otros/Verdura");
      });

      it('campo price', () => {
        expect(componet.formulario.controls['price'].value).toBe(1);
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

      it('Errores en campo name', fakeAsync(() => {
        name.value = '';
        dispatchEvent(name, 'input');
        componet.formulario.controls['name'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs[0].innerHTML).toContain('Falta el name del producto');
      }));

      it('Errores en campo type', fakeAsync(() => {
        type.value = '';
        dispatchEvent(type, 'input');
        componet.formulario.controls['type'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs[0].innerHTML).toContain('Seleccione un type');
      }));

      it('Error price invalido', fakeAsync(() => {
        price.value = '';
        dispatchEvent(price, 'input');
        componet.formulario.controls['price'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs[0].innerHTML).toContain('Introduzca el price');        
      }));

      it('Error price menor que 0,1', fakeAsync(() => {
        price.value = 0;
        dispatchEvent(price, 'input');
        componet.formulario.controls['price'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();     
        expect(msgs[0].innerHTML).toContain('El price debe ser mayor que 0');        
      }));
    });

  })

});
