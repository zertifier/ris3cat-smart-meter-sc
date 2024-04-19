import {Component} from '@angular/core';
import {
  BreakPoints,
  ScreenBreakPointsService
} from "../../../../../shared/infrastructure/services/screen-break-points.service";
import {map} from "rxjs";
import {AsyncPipe, NgClass} from "@angular/common";
import {UserStoreService} from "../../services/user-store.service";

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [
    NgClass,
    AsyncPipe
  ],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss'
})
export class UserProfilePageComponent {
  expandButtons$ = this.screensBreakpointsService
    .observeBreakpoints()
    .pipe(map(breakPoint => breakPoint <= BreakPoints.MD));

  firstName$ = this.userStore.selectOnly(state => state.user?.firstname)
    .pipe(map(firstName => firstName || "No hi ha nom"));

  lastName$ = this.userStore.selectOnly(state => state.user?.lastname)
    .pipe(map(lastname => lastname || "No hi ha cognom"));

  constructor(
    private readonly screensBreakpointsService: ScreenBreakPointsService,
    private readonly userStore: UserStoreService,
  ) {
  }
}
