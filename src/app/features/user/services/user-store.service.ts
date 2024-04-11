import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";

export interface UserStore {
  cupIds: number[],
  communityId?: number,
}

const defaultValues: UserStore = {
  cupIds: []
}

@Injectable({
  providedIn: 'root'
})
export class UserStoreService extends RxStore<UserStore> {
  constructor() {
    super(defaultValues);
  }
}
