import {CanActivateFn, Router} from "@angular/router";
import {AuthStoreService} from "../services/auth-store.service";
import {inject} from "@angular/core";

export const LoggedInGuard: CanActivateFn = () => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  const loggedIn = authStore.snapshotOnly(authStore.$.loggedIn);
  return loggedIn || router.createUrlTree(['/auth']);
}
