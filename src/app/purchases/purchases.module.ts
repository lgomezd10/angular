import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { ProductModule } from '../product/product.module';
import { PurchasesComponent } from './purchases/purchases.component';
import { PurchasesDateComponent } from './purchases-date/purchases-date.component';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolsModule } from '../tools/tools.module';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from "@angular/flex-layout";

const purchasesRoutes: Routes = [
  {
    path: 'purchases-dates',
    component: PurchasesDateComponent
  },  
  {
    path: 'purchases',
    component: PurchasesComponent
  }  
]

@NgModule({
  declarations: [PurchasesComponent, PurchasesDateComponent],
  imports: [
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProductModule,
    ToolsModule,
    MatDatepickerModule,
        BrowserAnimationsModule,
    RouterModule.forRoot(
      purchasesRoutes,
      { enableTracing: true }
    )
  ],
  exports: [
    PurchasesComponent,
    PurchasesDateComponent
  ]  
})
export class PurchasesModule { }
