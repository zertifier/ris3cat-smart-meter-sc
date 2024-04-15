import {Injectable} from '@angular/core';
import {AuthStoreService} from "../../auth/services/auth-store.service";
import {ZertipowerService} from "../../../shared/services/zertipower/zertipower.service";
import {UserStoreService} from "./user-store.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileUpdaterService {

  constructor(
    private authStore: AuthStoreService,
    private userStore: UserStoreService,
    private zertipower: ZertipowerService,
  ) {
    this.authStore.selectOnly(state => state.authData)
      .subscribe(async (authData) => {
        if (!authData) {
          return;
        }

        const users = await this.zertipower.getUsers({filters: []});
        const user = users.find(user => user.id === authData.id);
        if (!user) {
          throw new Error(`User with id ${authData.id} not found`);
        }

        const cups = await this.zertipower.getCups(user.id);
        // TODO remove this when the app is ready to handle users with no cups
        if (!cups.length) cups.push({
          cups: 'ES0031446428360001HM0F',
          community_id: 7,
          id: 36
        })
        const communityId = cups[0].community_id;
        const cupsReference = cups[0].cups;
        this.userStore.patchState({cupIds: cups.map((c: any) => c.id), communityId, cupsReference: cupsReference})
      });
  }
}
