import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserStoreService} from "../../../user/infrastructure/services/user-store.service";
import {map, skipWhile} from "rxjs";
import {ENERGY_STATS_ROUTE_NAMES} from "../pages/energy-stats-pages-routing.module";

export const hasCupsGuard: CanActivateFn = (route) => {
  const userStore = inject(UserStoreService);
  const router = inject(Router);
  return userStore.select().pipe(
    skipWhile((state) => !userStore.$.profileLoaded(state)),
    map((state) => {
      const {cups} = state;
      const routeName = route.data['name'];

      const tryStatsAccess = ENERGY_STATS_ROUTE_NAMES.STATS_CUPS === routeName;
      const hasCups = cups.length > 0;

      if (tryStatsAccess) {
        return hasCups || router.createUrlTree(['energy-stats/my-cup/missing']);
      }

      return !hasCups || router.createUrlTree(['energy-stats/my-cup']);
    })
  );
};
