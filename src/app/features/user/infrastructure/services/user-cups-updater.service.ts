import {Injectable} from '@angular/core';
import {EventBus} from "../../../../shared/domain/EventBus";
import {UserCupsChangedEvent} from "../../domain/UserCupsChangedEvent";
import {UpdateUserCupsAction} from "../../actions/update-user-cups-action.service";
import {AuthStoreService} from "../../../auth/infrastructure/services/auth-store.service";

@Injectable({
  providedIn: 'root'
})
export class UserCupsUpdaterService {

  constructor(
    private eventBus: EventBus,
    private updateUserCups: UpdateUserCupsAction,
    private authStore: AuthStoreService,
  ) {
    this.eventBus.subscribe(UserCupsChangedEvent.NAME, async () => {
      const authData = this.authStore.snapshotOnly(state => state.authData);

      if (!authData) {
        throw new Error('Auth data not saved!');
      }
      await this.updateUserCups.run(authData.id);
    });
  }
}
