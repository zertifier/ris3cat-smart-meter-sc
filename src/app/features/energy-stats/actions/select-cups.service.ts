import {Injectable} from '@angular/core';
import {UserStoreService} from "../../user/infrastructure/services/user-store.service";

@Injectable({
  providedIn: 'root'
})
export class SelectCupsService {

  constructor(private userStore: UserStoreService) { }

  public async run(selectedCupsIndex: number) {
    const cups = this.userStore.snapshotOnly(state => state.cups[selectedCupsIndex]);
    this.userStore.patchState({selectedCupsIndex, surplusDistribution: cups.surplusDistribution * 100})
  }
}
