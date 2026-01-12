import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { requestInterceptor } from '@app/tools/interceptors/request-interceptor';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideZoneChangeDetection } from '@angular/core';
import { httpErrorInterceptor } from '@app/errores/http-error.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([requestInterceptor, httpErrorInterceptor])
    ),
    providePrimeNG({
            theme: {
                preset: Aura
            }
    }),
    provideZoneChangeDetection()
  ]
});