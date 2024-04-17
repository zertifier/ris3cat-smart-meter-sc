import { Component } from '@angular/core';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownMenu,
  NgbDropdownModule,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {Confirmable} from "../../decorators/Confirmable";
import {LogoutActionService} from "../../../../features/auth/actions/logout-action.service";

@Component({
  selector: 'app-user-profile-selector',
  standalone: true,
  imports: [
    NgbDropdownModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownButtonItem
  ],
  templateUrl: './user-profile-selector.component.html',
  styleUrl: './user-profile-selector.component.scss'
})
export class UserProfileSelectorComponent {
  constructor(
    private readonly logoutAction: LogoutActionService,
  ) {
  }

  @Confirmable("Are you sure?", {confirmButton: 'Logout'})
  async logout() {
    await this.logoutAction.run();
  }

}
