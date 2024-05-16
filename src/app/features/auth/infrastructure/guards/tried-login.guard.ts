import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthStoreService} from "../services/auth-store.service";

export const triedLoginGuard: CanActivateFn = () => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  const loginTry = authStore.snapshotOnly(state => state.loginTry);
  return loginTry || router.createUrlTree(['/auth/login']);
};
