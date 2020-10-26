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
import { NavSalesComponent } from './nav-sales/nav-sales.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { ErroresModule } from '@app/errores/errores.module';


/*//TODO Rehacer routes
const salesRoutes: Routes = [
  {
    path: 'sales-dates',
    component: SalesDateComponent
  },  
  {
    path: 'sales',
    component: SalesComponent
  }  
]*/

@NgModule({
  declarations: [SalesComponent, SalesDateComponent, NavSalesComponent],
  imports: [   
    ErroresModule,    
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProductModule,
    ToolsModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    /*RouterModule.forRoot(
      salesRoutes,
      { enableTracing: true }
    )*/
  ],
  exports: [SalesComponent, SalesDateComponent, NavSalesComponent],
})
export class SalesModule { }
