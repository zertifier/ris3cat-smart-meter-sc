import {Injectable} from '@angular/core';
import {UserStoreService} from "../infrastructure/services/user-store.service";
import {ZertipowerService} from "../../../shared/infrastructure/services/zertipower/zertipower.service";

@Injectable({
  providedIn: 'root'
})
export class UpdateUserCupsAction {

  constructor(
    private userStore: UserStoreService,
    private zertipower: ZertipowerService,
  ) { }

  async run(userId: number) {
    const cups = await this.zertipower.users.getCups(userId);
    const surplusDistribution = parseFloat(cups[0]?.surplus_distribution || "0") * 100;
    this.userStore.patchState({
      surplusDistribution,
      selectedCupsIndex: 0,
      cups: cups.map(c => {
        return {
          id: c.id,
          communityId: c.community_id,
          reference: c.cups,
          surplusDistribution: parseFloat(c.surplus_distribution),
        }
      })
    })
  }
}
