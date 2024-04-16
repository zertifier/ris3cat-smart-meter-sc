import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";

export interface UserStore {
  cups: {
    id: number;
    reference: string;
    communityId: number;
    surplusDistribution: number;
  }[],
  selectedCupsIndex: number;
  activeMembers: number;
  totalMembers: number;
  surplusDistribution: number;
}

const defaultValues: UserStore = {
  cups: [],
  selectedCupsIndex: -1,
  activeMembers: 0,
  totalMembers: 0,
  surplusDistribution: 0,
}

@Injectable({
  providedIn: 'root'
})
export class UserStoreService extends RxStore<UserStore> {
  $ = {
    cupId: (state: UserStore) => state.cups[state.selectedCupsIndex]?.id,
    communityId: (state: UserStore) => state.cups[state.selectedCupsIndex]?.communityId,
    cupsReference: (state: UserStore) => state.cups[state.selectedCupsIndex]?.reference,
  }

  constructor() {
    super(defaultValues);
  }
}
