import { Component } from '@angular/core';
import {
  NoLoggedNavbarComponent
} from "../../../../shared/infrastructure/components/no-logged-navbar/no-logged-navbar.component";

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [
    NoLoggedNavbarComponent
  ],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.scss'
})
export class HelpPageComponent {

}
