import {Component, TemplateRef} from '@angular/core';
import {UserProfileSelectorComponent} from "../../user-profile-selector/user-profile-selector.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink, RouterLinkActive} from "@angular/router";
import defaultCallbacks from "chart.js/dist/plugins/plugin.tooltip";

@Component({
  selector: 'app-short-navbar',
  standalone: true,
  imports: [
    UserProfileSelectorComponent,
    RouterLink,
    RouterLinkActive
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
    this.ngbModalService.open(content, {size: "xl"});
  }
}
