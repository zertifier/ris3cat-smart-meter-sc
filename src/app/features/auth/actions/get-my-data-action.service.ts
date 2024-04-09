import {Injectable} from '@angular/core';
import {AuthStoreService} from "../services/auth-store.service";
import {ZertipowerService} from "../../../shared/services/zertipower/zertipower.service";

@Injectable({
  providedIn: 'root'
})
export class GetMyDataAction {

  constructor(
    private authStore: AuthStoreService,
    private zertipower: ZertipowerService
  ) {
  }

  async run() {
    const authData = this.authStore.snapshotOnly(state => state.authData);
    if (!authData) {
      throw new Error("Auth data is not defined")
    }

    const userId = authData.id;
    const users = await this.zertipower.getUsers({filters: []});
    const user = users.find(user => user.id === userId);
    if (!user) {
      throw new Error("User not found")
    }

    return user;
  }
}
