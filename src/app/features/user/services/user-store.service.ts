import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";

export interface UserStore {
  cups: {
    id: number;
    reference: string;
    communityId: number;
    surplusDistribution: number;
  }[],
  cupIds: number[];
  communityId?: number;
  cupsReference: string;
  selectedCupsIndex: number;
  activeMembers: number;
  totalMembers: number;
  surplusDistribution: number;
}

const defaultValues: UserStore = {
  cupIds: [],
  cupsReference: '',
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
  constructor() {
    super(defaultValues);
  }
}
