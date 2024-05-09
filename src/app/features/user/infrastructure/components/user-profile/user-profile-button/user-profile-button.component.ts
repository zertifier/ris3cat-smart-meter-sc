import {Component} from '@angular/core';
import {UserProfileMenuComponent} from "../user-profile-menu/user-profile-menu.component";
import {UserProfileSelectorComponent} from "../user-profile-selector/user-profile-selector.component";
import {BreakPoints, ScreenBreakPointsService} from "../../../../../../shared/infrastructure/services/screen-break-points.service";
import {map} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-user-profile-button',
  standalone: true,
  imports: [
    UserProfileMenuComponent,
    UserProfileSelectorComponent,
    AsyncPipe
  ],
  templateUrl: './user-profile-button.component.html',
  styleUrl: './user-profile-button.component.scss'
})
export class UserProfileButtonComponent {
  hasSpace = this.breakPointsService.observeBreakpoints()
    .pipe(
      map(value => value >= BreakPoints.LG)
    )

  constructor(private breakPointsService: ScreenBreakPointsService) {
  }
}
