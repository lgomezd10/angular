import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CajaComponent } from './caja/caja.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { ProductoModule } from '../producto/producto.module';
import { VentasFechaComponent } from './ventas-fecha/ventas-fecha.component';
import {MatDatepickerModule} from '@angular/material/datepicker';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HerramientasModule } from '../herramientas/herramientas.module';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const ventasRoutes: Routes = [
  {
    path: 'ventas-fechas',
    component: VentasFechaComponent
  },  
  {
    path: 'caja',
    component: CajaComponent
  }  
]

@NgModule({
  declarations: [CajaComponent, VentasFechaComponent],
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProductoModule,
    HerramientasModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      ventasRoutes,
      { enableTracing: true }
    )
  ],
  exports: [CajaComponent],
})
export class CajaModule { }
