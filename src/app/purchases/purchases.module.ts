import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductModule } from '../product/product.module';
import { PurchasesComponent } from './purchases/purchases.component';
import { PurchasesDateComponent } from './purchases-date/purchases-date.component';

import { ToolsModule } from '../tools/tools.module';
import { NavPurchasesComponent } from './nav-purchases/nav-purchases.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { TabsModule } from 'primeng/tabs';

@NgModule({ declarations: [NavPurchasesComponent],
    exports: [
        PurchasesComponent,
        PurchasesDateComponent,
    ], imports: [PurchasesComponent,
        PurchasesDateComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProductModule,
        ToolsModule,
        TabsModule,
        AppRoutingModule], providers: [] })
export class PurchasesModule { }
