import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {environment} from '../environments/environment';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth-interceptor';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideNgxStripe} from 'ngx-stripe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNgxStripe(environment.STRIPE_PUBLIC_KEY),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ]
};
