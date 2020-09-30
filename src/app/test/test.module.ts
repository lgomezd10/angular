import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, Router, provideRoutes, ActivatedRoute } from '@angular/router';
import { ProductComponent } from '../product/product/product.component';
import { ComponentFixture, tick, TestBed } from '@angular/core/testing';
import { MockProductsService } from './products.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductsComponent } from '../product/products/products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../product/filter.pipe';
import { SortPipe } from '../product/sort.pipe';
import { ProductPipe } from '../product/product.pipe';

@Component({
  selector: 'blank-cmp',
  template: ``
})
export class BlankCmp {
}

@Component({
  selector: 'root-cmp',
  template: `<router-outlet></router-outlet>`
})
export class RootCmp {
}

export const routerConfig: Routes = [
  { path: '', component: BlankCmp },
  { path: 'products', component: ProductsComponent},
  { path: 'product/:productId', component: ProductComponent }
  
];

export function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}

export function createRoot(router: Router,
                           componentType: any): ComponentFixture<any> {
  const f = TestBed.createComponent(componentType);
  advance(f);
  (<any>router).initialNavigation();
  advance(f);  
  return f;
}

export function ConfigureProductTest() {
  const mockSpotifyService: MockProductsService = new MockProductsService();

  TestBed.configureTestingModule({
    imports: [
      { // TODO RouterTestingModule.withRoutes coming soon
        ngModule: RouterTestingModule,
        providers: [provideRoutes(routerConfig)],       
      },
      TestModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      mockSpotifyService.getProviders(),
      {
        provide: ActivatedRoute,
        useFactory: (r: Router) => r.routerState.root, deps: [ Router ]
      }
    ]
  });
}



@NgModule({
  imports: [RouterTestingModule, CommonModule, FormsModule],
  entryComponents: [
    BlankCmp,
    RootCmp,
    ProductComponent
  ],
  exports: [
    BlankCmp,
    RootCmp,
    ProductComponent
  ],  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    BlankCmp,
    RootCmp,
    ProductComponent
  ]
})
export class TestModule { }
