import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {authTokenInterceptor} from "./features/auth/interceptors/auth-token.interceptor";
import {EventBus} from "./shared/domain/EventBus";
import {InMemoryEventBusService} from "./shared/infrastructure/services/in-memory-event-bus.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authTokenInterceptor])
    ),
    provideAnimations(),
    {provide: EventBus, useClass: InMemoryEventBusService},
  ]
};
