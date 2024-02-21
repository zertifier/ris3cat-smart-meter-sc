import { Component } from '@angular/core';
import {NavbarComponent} from "../../../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-my-community-page',
  standalone: true,
  imports: [
    NavbarComponent
  ],
  templateUrl: './my-community-page.component.html',
  styleUrl: './my-community-page.component.scss'
})
export class MyCommunityPageComponent {

}
