import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AppLogoComponent} from "../app-logo/app-logo.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AppLogoComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
