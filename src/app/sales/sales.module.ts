import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales/sales.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { ProductModule } from '../product/product.module';
import { SalesDateComponent } from './sales-date/sales-date.component';
import {MatDatepickerModule} from '@angular/material/datepicker';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToolsModule } from '../tools/tools.module';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const ventasRoutes: Routes = [
  {
    path: 'sales-dates',
    component: SalesDateComponent
  },  
  {
    path: 'sales',
    component: SalesComponent
  }  
]

@NgModule({
  declarations: [SalesComponent, SalesDateComponent],
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProductModule,
    ToolsModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      ventasRoutes,
      { enableTracing: true }
    )
  ],
  exports: [SalesComponent],
})
export class SalesModule { }
