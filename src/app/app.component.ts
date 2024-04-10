import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {ProfileUpdaterService} from "./features/user/services/profile-updater.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'smart-meter-frontend';
  constructor(private profileUpdater: ProfileUpdaterService) {
  }
}
