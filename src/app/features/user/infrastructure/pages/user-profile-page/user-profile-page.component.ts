import {Component} from '@angular/core';
import {
  BreakPoints,
  ScreenBreakPointsService
} from "../../../../../shared/infrastructure/services/screen-break-points.service";
import {map} from "rxjs";
import {AsyncPipe, NgClass} from "@angular/common";

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

  constructor(private readonly screensBreakpointsService: ScreenBreakPointsService) {
  }
}
