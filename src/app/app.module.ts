import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ProductoModule } from './producto/producto.module';
import { HttpClientModule } from '@angular/common/http';
import { CajaModule } from './caja/caja.module';
import { LogoComponent } from './logo/logo.component';
import { CajaComponent } from './caja/caja/caja.component';
import { ProductosComponent } from './producto/productos/productos.component';
import { ComprasComponent } from './compras/compras/compras.component';
import { ComprasModule } from './compras/compras.module';
import { ErroresComponent } from './errores/errores/errores.component';
import { ErroresModule } from './errores/errores.module';
import { HerramientasModule } from './herramientas/herramientas.module';
import { ProductoComponent } from './producto/producto/producto.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";

const appRoutes: Routes = [
  {
    path: '',
    component: CajaComponent
  },
  {
    path: 'caja',
    component: CajaComponent
  },
  {
    path: 'productos',
    component: ProductosComponent
  },
  {
    path: 'compras',
    component: ComprasComponent
  },
  {
    path: 'error',
    component: ErroresComponent
  },
  {
    path: 'producto/:productoId',
    component: ProductoComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LogoComponent
  ],
  imports: [
    BrowserModule,
    ProductoModule,
    CajaModule,
    ComprasModule,
    ErroresModule,
    HerramientasModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    BrowserAnimationsModule
    
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
