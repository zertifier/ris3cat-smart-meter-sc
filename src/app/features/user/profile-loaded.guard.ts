import {CanActivateFn} from '@angular/router';
import {filter, map} from "rxjs";
import {UserStoreService} from "./services/user-store.service";
import {inject} from "@angular/core";

export const profileLoadedGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStoreService);
  return userStore.selectOnly(userStore.$.communityId).pipe(filter(id => !!id),
    map(() => true)
  );
};
