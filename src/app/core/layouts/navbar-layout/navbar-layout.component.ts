import {Component} from '@angular/core';
import {NavbarComponent} from "../../../shared/infrastructure/components/navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "../../../shared/infrastructure/components/footer/footer.component";

@Component({
  selector: 'app-navbar-layout',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    FooterComponent
  ],
  templateUrl: './navbar-layout.component.html',
  styleUrl: './navbar-layout.component.scss'
})
export class NavbarLayoutComponent {

}
