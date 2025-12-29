import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { loggingInterceptor } from '@app/tools/interceptors/logging-interceptor';
import { requestInterceptor } from '@app/tools/interceptors/request-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([loggingInterceptor, requestInterceptor])
    )
  ]
});