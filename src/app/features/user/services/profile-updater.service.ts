import {Injectable} from '@angular/core';
import {AuthStoreService} from "../../auth/services/auth-store.service";
import {UserStoreService} from "./user-store.service";
import {ZertipowerService} from "../../../shared/infrastructure/services/zertipower/zertipower.service";

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
        const surplusDistribution = parseFloat(cups[0]?.surplus_distribution || "0") * 100;
        this.userStore.patchState({
          selectedCupsIndex: 0,
          surplusDistribution,
          cups: cups.map(c => {
            return {
              id: c.id,
              communityId: c.community_id,
              reference: c.cups,
              surplusDistribution: parseFloat(c.surplus_distribution)
            }
          })
        })
      });
  }
}
