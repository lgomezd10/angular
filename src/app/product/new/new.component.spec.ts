import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { NewComponent } from './new.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  dispatchEvent,
  ConsoleSpy
} from '../../test/utils';
import { By } from '@angular/platform-browser';
import { MockProductsService } from 'src/app/test/products.service.mock';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToolsService } from 'src/app/tools/tools.service';
import { MockToolsServices } from 'src/app/test/tools.service.mock';
import { CommonModule } from '@angular/common';
import { ProductModule } from '../product.module';

describe('NewComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  beforeEach(async(() => {

    const mockProductsService: MockProductsService = new MockProductsService();
    const mocktoolsServices: MockToolsServices = new MockToolsServices();
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ProductModule],
      providers: [
        mockProductsService.getProviders(),
        { provide: ToolsService, useValue: mocktoolsServices }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [NewComponent]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
        name.value = 'product1';
        dispatchEvent(name, 'input');
        type.options[6].selected = true;
        dispatchEvent(type, 'change');
        price.value = 1;
        dispatchEvent(price, 'input');
        fixture.detectChanges();
        
      }));

      afterAll(() => {
        component.formGroup.reset();
      })

      it('campo name', () => {
        expect(component.formGroup.controls['name'].value).toBe('product1');
      });
      it('campo type', () => {
        expect(component.formGroup.controls['type'].value).toBe("Otros/Verdura");
      });

      it('campo price', () => {
        expect(component.formGroup.controls['price'].value).toBe(1);
      });

      it('No lanza errores',fakeAsync(() => { 
        component.formGroup.markAllAsTouched();     
        fixture.detectChanges();  
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs.length).toBe(0);
      }))

    });

    describe('Errores en formulario', () => {

      afterEach(() => component.formGroup.reset());

      it('Errores en campo name', fakeAsync(() => {
        name.value = '';
        dispatchEvent(name, 'input');
        component.formGroup.controls['name'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs[0].innerHTML).toContain('Falta el name del product');
      }));

      it('Errores en campo type', fakeAsync(() => {
        type.value = '';
        dispatchEvent(type, 'input');
        component.formGroup.controls['type'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs[0].innerHTML).toContain('Seleccione un type');
      }));

      it('Error price invalido', fakeAsync(() => {
        price.value = '';
        dispatchEvent(price, 'input');
        component.formGroup.controls['price'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();        
        expect(msgs[0].innerHTML).toContain('Introduzca el price');        
      }));

      it('Error price menor que 0,1', fakeAsync(() => {
        price.value = 0;
        dispatchEvent(price, 'input');
        component.formGroup.controls['price'].markAsTouched();        
        fixture.detectChanges();
        const msgs = el.querySelectorAll('.help.is-danger');
        fixture.detectChanges();     
        expect(msgs[0].innerHTML).toContain('El price debe ser mayor que 0');        
      }));
    });

  })

});
