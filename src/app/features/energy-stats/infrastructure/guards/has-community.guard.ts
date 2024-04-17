import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserStoreService} from "../../../user/services/user-store.service";
import {ENERGY_STATS_ROUTE_NAMES} from "../pages/energy-stats-pages-routing.module";
import {map, skipWhile} from "rxjs";

export const hasCommunityGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStoreService);
  const router = inject(Router);
  return userStore.select().pipe(
    skipWhile((state) => !userStore.$.profileLoaded(state)),
    map((state) => {
      const {cups} = state;
      const routeName = route.data['name'];

      const tryStatsAccess = ENERGY_STATS_ROUTE_NAMES.STATS_COMMUNITY === routeName;
      const hasCommunity = cups.length > 0;

      if (tryStatsAccess) {
        return hasCommunity || router.createUrlTree(['energy-stats/community/missing']);
      }

      return !hasCommunity || router.createUrlTree(['energy-stats/community']);
    })
  );
};
