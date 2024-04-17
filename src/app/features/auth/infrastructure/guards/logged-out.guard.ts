import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthStoreService} from "../services/auth-store.service";

export const LoggedOutGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  const loggedIn = authStore.snapshotOnly(authStore.$.loggedIn);
  if (!loggedIn) {
    return true;
  } else {
    return router.createUrlTree(['/energy-stats']);
  }
};
