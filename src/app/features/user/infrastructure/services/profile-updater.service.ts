import {Injectable} from '@angular/core';
import {AuthStoreService} from "../../../auth/infrastructure/services/auth-store.service";
import {UserStoreService} from "./user-store.service";
import {ZertipowerService} from "../../../../shared/infrastructure/services/zertipower/zertipower.service";
import {EventBus} from "../../../../shared/domain/EventBus";
import {UserLoggedInEvent} from "../../../auth/domain/UserLoggedInEvent";
import {UserProfileChanged} from "../../../auth/domain/UserProfileChanged";

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
    this.eventBus.subscribe(UserProfileChanged.NAME, async () => {
      const userProfile = this.userStore.snapshotOnly(state => state.user);
      if (!userProfile) {
        throw new Error("User profile not defined");
      }

      const user = await this.findUserProfileById(userProfile.id);
      this.userStore.patchState({user});
    });

    this.eventBus.subscribe(UserLoggedInEvent.NAME, async () => {
      const authData = this.authStore.snapshotOnly(state => state.authData);

      if (!authData) {
        return;
      }

      const user = await this.findUserProfileById(authData.id);
      const cups = await this.zertipower.users.getCups(user.id);
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

  private async findUserProfileById(id: number) {
    const users = await this.zertipower.users.get({filters: []});
    const user = users.find(user => user.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  }
}
