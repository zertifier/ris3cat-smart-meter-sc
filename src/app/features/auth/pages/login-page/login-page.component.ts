import {Component} from '@angular/core';
import {OauthLoginComponent} from "../../components/oauth-login/oauth-login.component";
import {NgbModal, NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {WebWalletLoginComponent} from "../../components/web-wallet-login/web-wallet-login.component";

export enum LoginTabs {
  OAUTH_TAB = 1,
  WEB_WALLET_TAB = 2
}

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
  public activeId: number = LoginTabs.OAUTH_TAB;

  public googleActive: boolean = false;

  constructor(private ngbModal: NgbModal) {
  }

  protected readonly LoginTabs = LoginTabs;
}
