import {HttpInterceptorFn} from '@angular/common/http';
import {AuthStoreService} from "../services/auth-store.service";
import {inject} from "@angular/core";

export const SKIP_AUTH_INTERCEPTOR = 'X-Skip-Interceptor';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has(SKIP_AUTH_INTERCEPTOR)) {
    return next(req);
  }

  const authStore = inject(AuthStoreService);
  const authToken = authStore.snapshotOnly(state => state.accessToken);

  const headers = req.headers.set('Authorization', `Bearer ${authToken}`);
  const newRequest = req.clone({headers});

  return next(newRequest);
};
