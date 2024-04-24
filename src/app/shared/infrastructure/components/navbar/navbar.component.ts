import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AppLogoComponent} from "../app-logo/app-logo.component";
import {UserProfileSelectorComponent} from "../user-profile-selector/user-profile-selector.component";
import {AsyncPipe, NgClass, NgStyle, NgSwitch, NgSwitchCase} from "@angular/common";
import {BreakPoints, ScreenBreakPointsService} from "../../services/screen-break-points.service";
import {LargeNavbarComponent} from "./large-navbar/large-navbar.component";
import {ShortNavbarComponent} from "./short-navbar/short-navbar.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AppLogoComponent,
    UserProfileSelectorComponent,
    NgStyle,
    NgClass,
    AsyncPipe,
    NgSwitch,
    LargeNavbarComponent,
    ShortNavbarComponent,
    NgSwitchCase
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentBreakPoint = this.screenBreakpointsService.observeBreakpoints();
  constructor(private screenBreakpointsService: ScreenBreakPointsService) {}

  protected readonly BreakPoints = BreakPoints;
}
