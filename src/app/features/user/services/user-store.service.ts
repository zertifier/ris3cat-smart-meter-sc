import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";

export interface UserStore {
  cupIds: number[],
  communityId?: number,
  cupsReference: string,
}

const defaultValues: UserStore = {
  cupIds: [],
  cupsReference: '',
}

@Injectable({
  providedIn: 'root'
})
export class UserStoreService extends RxStore<UserStore> {
  constructor() {
    super(defaultValues);
  }
}
