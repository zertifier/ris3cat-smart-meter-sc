import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AppLogoComponent} from "../app-logo/app-logo.component";
import {UserProfileSelectorComponent} from "../user-profile-selector/user-profile-selector.component";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AppLogoComponent,
    UserProfileSelectorComponent,
    NgStyle
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
