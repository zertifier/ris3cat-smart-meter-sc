import { Component } from '@angular/core';
import {OauthLoginComponent} from "../../components/oauth-login/oauth-login.component";
import {NgbModal, NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {WebWalletLoginComponent} from "../../components/web-wallet-login/web-wallet-login.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    OauthLoginComponent,
    NgbNav,
    NgbNavItem,
    NgbNavLinkButton,
    WebWalletLoginComponent,
    NgbNavContent,
    NgbNavOutlet
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  constructor(private ngbModal: NgbModal) {
  }
  public openModal(): void {
    this.ngbModal.open(OauthLoginComponent)
  }
}
