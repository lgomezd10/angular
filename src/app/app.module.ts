import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ProductModule } from './product/product.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SalesModule } from './sales/sales.module';
import { PurchasesModule } from './purchases/purchases.module';
import { ErroresModule } from './errores/errors.module';
import { ToolsModule } from './tools/tools.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    exports: [],
    imports: [FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        ProductModule,
        SalesModule,
        PurchasesModule,
        ErroresModule,
        ToolsModule,
        AppRoutingModule,
        ButtonModule],
    providers: [provideHttpClient(withInterceptorsFromDi())
    ],
    bootstrap: []
})
export class AppModule { }
