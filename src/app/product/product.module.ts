import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductsService } from './products.service';
import { RouterModule } from '@angular/router';
import { ToolsModule } from '../tools/tools.module';

@NgModule({
    declarations: [],
    exports: [],
    imports: [ToolsModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
    providers: [
        ProductsService,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class ProductModule { }
