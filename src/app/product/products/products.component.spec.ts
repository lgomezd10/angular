import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { MockProductsService } from 'src/app/test/products.service.mock';
import { ProductsService } from '../products.service';
import { ActivatedRoute } from '@angular/router';
import { FilterPipe } from '../filter.pipe';
import { SortPipe } from '../sort.pipe';
import { ProductPipe } from '../product.pipe';
import { Product } from '../product';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class MockActivatedRoute {

}
describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async(() => {
    const mockProductsService: MockProductsService = new MockProductsService();
    TestBed.configureTestingModule({
      declarations: [ProductsComponent, FilterPipe, SortPipe, ProductPipe],
      providers: [
        //{provide: ProductsService, useValue: mockProductsService},
        mockProductsService.getProviders(),
        { provide: ActivatedRoute, useValue: MockActivatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
      //TestBed.configureTestingModule({
      //  declarations: [ ProductsComponent ]
      //})
      //.compileComponents();
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('cargar products', fakeAsync(
    inject([ProductsService, ActivatedRoute], (mockProductsService: MockProductsService, r) => {
      var products;
      const product1 = new Product();
      product1.name = "pera";
      const product2 = new Product();
      product2.name = "platano";
      mockProductsService.setProducts([product1, product2]);      
      component.products$.subscribe(p => {
        products = p;        
      });
      tick();
      expect(products).toEqual([product1, product2]);

    })));

    it('sin cargar products', fakeAsync(
      inject([ProductsService, ActivatedRoute], (mockProductsService: MockProductsService, r) => {
        console.log("prueba");
        var products;
        const product1 = new Product();
        product1.name = "pera";
        const product2 = new Product();
        product2.name = "platano";
        //mockProductsService.setProducts([product1, product2]);      
        component.products$.subscribe(p => {
          products = p;        
        });
        tick();
        expect(products).toEqual([]);
  
      })));
});
