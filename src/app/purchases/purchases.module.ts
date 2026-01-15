import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductModule } from '../product/product.module';
import { PurchasesComponent } from './purchases/purchases.component';
import { PurchasesDateComponent } from './purchases-date/purchases-date.component';

import { ToolsModule } from '../tools/tools.module';
import { NavPurchasesComponent } from './nav-purchases/nav-purchases.component';


@NgModule({ declarations: [],
    exports: [
        PurchasesComponent,
        PurchasesDateComponent,
        NavPurchasesComponent
    ], imports: [PurchasesComponent,
        PurchasesDateComponent,
        CommonModule,
        ProductModule,
        ToolsModule,
        NavPurchasesComponent], providers: [] })
export class PurchasesModule { }
