import { Component } from '@angular/core';
import {NavbarComponent} from "../../../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-my-cup-page',
  standalone: true,
  imports: [
    NavbarComponent
  ],
  templateUrl: './my-cup-page.component.html',
  styleUrl: './my-cup-page.component.scss'
})
export class MyCupPageComponent {

}
