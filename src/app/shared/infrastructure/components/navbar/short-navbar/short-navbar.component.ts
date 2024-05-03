import {Component, TemplateRef} from '@angular/core';
import {UserProfileSelectorComponent} from "../../user-profile/user-profile-selector/user-profile-selector.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {UserProfileButtonComponent} from "../../user-profile/user-profile-button/user-profile-button.component";

@Component({
  selector: 'app-short-navbar',
  standalone: true,
  imports: [
    UserProfileSelectorComponent,
    RouterLink,
    RouterLinkActive,
    UserProfileButtonComponent
  ],
  templateUrl: './short-navbar.component.html',
  styleUrl: './short-navbar.component.scss'
})
export class ShortNavbarComponent {
  buttons: { label: string, route: string }[] = [
    {route: '/energy-stats/community', label: 'La meva comunitat'},
    {route: '/energy-stats/my-cup', label: 'El meu CUPS'},
    {route: '/energy-stats/share', label: 'Compartir energia'},
    {route: '/energy-stats/governance', label: 'Governança'}
  ]

  constructor(private readonly ngbModalService: NgbModal) {

  }

  showMenu(content: TemplateRef<any>) {
    this.ngbModalService.open(content, {fullscreen: true, backdrop: false, modalDialogClass: 'transparent-modal'});
  }
}
