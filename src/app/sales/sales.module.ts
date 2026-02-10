import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales/sales.component';
import { ProductModule } from '../product/product.module';
import { SalesDateComponent } from './sales-date/sales-date.component';

import { ToolsModule } from '../tools/tools.module';
import { AppRoutingModule } from '../app-routing.module';
import { ErroresModule } from '../errores/errors.module';
import { NavSalesComponent } from './nav-sales/nav-sales.component';


@NgModule({ declarations: [],
    exports: [SalesComponent, SalesDateComponent, NavSalesComponent], 
    imports: [ErroresModule,
    AppRoutingModule,
    SalesDateComponent,
    NavSalesComponent,
    SalesComponent,
    CommonModule,
    ProductModule,
    ToolsModule], providers: [] })
export class SalesModule { }
