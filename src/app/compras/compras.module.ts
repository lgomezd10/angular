import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { ProductoModule } from '../producto/producto.module';
import { ComprasComponent } from './compras/compras.component';
import { ComprasFechaComponent } from './compras-fecha/compras-fecha.component';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HerramientasModule } from '../herramientas/herramientas.module';
import { Routes, RouterModule } from '@angular/router';
import { CajaComponent } from '../caja/caja/caja.component';
import { FlexLayoutModule } from "@angular/flex-layout";

const comprasRoutes: Routes = [
  {
    path: 'compras-fechas',
    component: ComprasFechaComponent
  },  
  {
    path: 'compras',
    component: ComprasComponent
  }  
]

@NgModule({
  declarations: [ComprasComponent, ComprasFechaComponent],
  imports: [
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ProductoModule,
    HerramientasModule,
    MatDatepickerModule,
        BrowserAnimationsModule,
    RouterModule.forRoot(
      comprasRoutes,
      { enableTracing: true }
    )
  ],
  exports: [
    ComprasComponent,
    ComprasFechaComponent
  ]  
})
export class ComprasModule { }
