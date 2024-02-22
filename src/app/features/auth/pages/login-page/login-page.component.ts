import {Component} from '@angular/core';
import {OauthLoginComponent} from "../../components/oauth-login/oauth-login.component";
import {NgbModal, NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {WebWalletLoginComponent} from "../../components/web-wallet-login/web-wallet-login.component";
import {LoginImagesService} from "../../services/login-images.service";
import {NgOptimizedImage} from "@angular/common";

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
    NgbNavOutlet,
    NgOptimizedImage
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  public activeId: number = LoginTabs.OAUTH_TAB;
  public imageUrl = this.loginImagesService.getRandomImage();

  public googleActive: boolean = false;

  constructor(private ngbModal: NgbModal, public loginImagesService: LoginImagesService) {
  }

  protected readonly LoginTabs = LoginTabs;
}
