import {Component} from '@angular/core';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownMenu,
  NgbDropdownModule,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {Confirmable} from "../../decorators/Confirmable";
import {LogoutActionService} from "../../../../features/auth/actions/logout-action.service";
import {UserStoreService} from "../../../../features/user/services/user-store.service";
import {map} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {TextShorterPipe} from "../../pipes/wallet-address-shortener.pipe";

@Component({
  selector: 'app-user-profile-selector',
  standalone: true,
  imports: [
    NgbDropdownModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownButtonItem,
    AsyncPipe,
    TextShorterPipe
  ],
  templateUrl: './user-profile-selector.component.html',
  styleUrl: './user-profile-selector.component.scss'
})
export class UserProfileSelectorComponent {
  userWallet$ = this.userStore
    .selectOnly(state => state.user?.wallet_address)
    .pipe(
      map(wallet => {
        if (!wallet) {
          return 'No Wallet'
        }

        return new TextShorterPipe().transform(wallet, 6, 4);
      })
    );
  userName$ = this.userStore.selectOnly(state => state.user?.username)
    .pipe(
      map(username => username || 'Anònim'),
    );

  constructor(
    private readonly logoutAction: LogoutActionService,
    private readonly userStore: UserStoreService,
  ) {
  }

  @Confirmable("Are you sure?", {confirmButton: 'Logout'})
  async logout() {
    await this.logoutAction.run();
  }

}
