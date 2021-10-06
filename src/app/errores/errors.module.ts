import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { CapturaErrores } from './captura-errores';
import { ErrorService } from './error.service';

@NgModule({
  declarations: [ShowErrorsComponent],
  imports: [
    CommonModule
  ],
  exports: [ShowErrorsComponent],
  providers: [
    ErrorService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    CapturaErrores,
    { provide: ErrorHandler, useClass: CapturaErrores }
  ],
})
export class ErroresModule { }
