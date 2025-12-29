import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi }    from '@angular/common/http';
import { ProductModule } from '../product/product.module';
import { PurchasesComponent } from './purchases/purchases.component';
import { PurchasesDateComponent } from './purchases-date/purchases-date.component';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { ToolsModule } from '../tools/tools.module';
import { Routes, RouterModule } from '@angular/router';
import { NavPurchasesComponent } from './nav-purchases/nav-purchases.component';
import { AppRoutingModule } from '@app/app-routing.module';

/*const purchasesRoutes: Routes = [
  {
    path: 'purchases-dates',
    component: PurchasesDateComponent
  },  
  {
    path: 'purchases',
    component: PurchasesComponent
  }  
]*/

@NgModule({ declarations: [NavPurchasesComponent],
    exports: [
        PurchasesComponent,
        PurchasesDateComponent
    ], imports: [PurchasesComponent,
        PurchasesDateComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProductModule,
        ToolsModule,
        MatDatepickerModule,
        AppRoutingModule], providers: [] })
export class PurchasesModule { }
