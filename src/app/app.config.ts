import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideZonelessChangeDetection } from '@angular/core';
import { authInterceptor } from './Services/auth.interceptor';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), // 🔐 Interceptor JWT
    provideAnimations(),
    provideZonelessChangeDetection(),

    // 👇 Agregamos soporte global para Datepicker
    importProvidersFrom(
      MatDatepickerModule,
      MatNativeDateModule
    )
  ],
};
