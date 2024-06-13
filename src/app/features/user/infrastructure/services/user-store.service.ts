import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";
import {Wallet} from "ethers";

export interface UserProfile {
  id: number,
  firstname: string,
  role: string,
  username: string,
  email: string,
  lastname: string,
  wallet_address: string,
  customer_id?: number,
  wallet?: Wallet
}

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
  user?: UserProfile;
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
    profileLoaded: (state: UserStore) => state.selectedCupsIndex !== -1,
  }

  constructor() {
    super(defaultValues);
  }
}
