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
          id: 26,
          cups: "ES0031446428502001MA0F",
          provider_id: 9,
          community_id: 7,
          surplus_distribution: "0.02",
          location_id: 1,
          customer_id: 21,
          type: "consumer",
          datadis_active: 1,
          smart_meter_active: 0,
          smart_meter_model: "",
          inverter_active: 0,
          sensor_active: 0,
          created_at: "2024-02-07T14:50:31.000Z",
          updated_at: "2024-03-22T08:02:09.000Z"
        })
        const communityId = cups[0].community_id;
        const cupsReference = cups[0].cups;
        const surplusDistribution = parseFloat(cups[0].surplus_distribution) * 100;
        this.userStore.patchState({
          selectedCupsIndex: 0,
          cupIds: cups.map((c: any) => c.id),
          communityId,
          cupsReference: cupsReference,
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
