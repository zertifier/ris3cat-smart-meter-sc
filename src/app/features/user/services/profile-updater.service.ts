import {Injectable} from '@angular/core';
import {AuthStoreService} from "../../auth/infrastructure/services/auth-store.service";
import {UserStoreService} from "./user-store.service";
import {ZertipowerService} from "../../../shared/infrastructure/services/zertipower/zertipower.service";
import {EventBus} from "../../../shared/domain/EventBus";
import {UserLoggedInEvent} from "../../auth/domain/UserLoggedInEvent";
import {CupsResponseDTO} from "../../../shared/infrastructure/services/zertipower/DTOs/CupsResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class ProfileUpdaterService {

  constructor(
    private authStore: AuthStoreService,
    private userStore: UserStoreService,
    private zertipower: ZertipowerService,
    private eventBus: EventBus,
  ) {
    this.eventBus.subscribe(UserLoggedInEvent.NAME, async (event) => {
      const authData = this.authStore.snapshotOnly(state => state.authData);

      if (!authData) {
        return;
      }

      const users = await this.zertipower.getUsers({filters: []});
      const user = users.find(user => user.id === authData.id);
      if (!user) {
        throw new Error(`User with id ${authData.id} not found`);
      }

      const cups = await this.zertipower.getCups(user.id);
      // const cups: CupsResponseDTO[] = [];
      const surplusDistribution = parseFloat(cups[0]?.surplus_distribution || "0") * 100;
      this.userStore.patchState({
        selectedCupsIndex: 0,
        surplusDistribution,
        user,
        cups: cups.map(c => {
          return {
            id: c.id,
            communityId: c.community_id,
            reference: c.cups,
            surplusDistribution: parseFloat(c.surplus_distribution),
          }
        })
      })
    });
  }
}
