import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { ErroresComponent } from './errores/errores.component';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { CapturaErrores } from './captura-errores';
import { ErrorService } from './error.service';

@NgModule({
  declarations: [ErroresComponent],
  imports: [
    CommonModule
  ],
  exports: [ErroresComponent],
  providers: [
    ErrorService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    CapturaErrores,
    { provide: ErrorHandler, useClass: CapturaErrores }
  ],
})
export class ErroresModule { }
