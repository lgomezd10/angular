import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, Router, provideRoutes, ActivatedRoute } from '@angular/router';
import { ProductoComponent } from '../producto/producto/producto.component';
import { ComponentFixture, tick, TestBed } from '@angular/core/testing';
import { MockProductosService } from './productos.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductosComponent } from '../producto/productos/productos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../producto/filter.pipe';
import { SortPipe } from '../producto/sort.pipe';
import { ProductoPipe } from '../producto/producto.pipe';

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
  { path: 'productos', component: ProductosComponent},
  { path: 'producto/:productoId', component: ProductoComponent }
  
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
  console.log("comprobar el componente",f.componentInstance);
  return f;
}

export function ConfigureProductoTest() {
  const mockSpotifyService: MockProductosService = new MockProductosService();

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
    ProductoComponent
  ],
  exports: [
    BlankCmp,
    RootCmp,
    ProductoComponent
  ],  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    BlankCmp,
    RootCmp,
    ProductoComponent
  ]
})
export class TestModule { }
