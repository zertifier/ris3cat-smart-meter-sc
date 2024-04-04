import { Component } from '@angular/core';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownMenu,
  NgbDropdownModule,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";

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

}
