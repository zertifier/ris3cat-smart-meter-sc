import {Component, EventEmitter, Output} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-web-wallet-login',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './web-wallet-login.component.html',
  styleUrl: './web-wallet-login.component.scss'
})
export class WebWalletLoginComponent {
  @Output('oauthLoginRequest') oauthLoginRequest: EventEmitter<void> = new EventEmitter<void>();
  constructor(
  ) {
  }

  loginWithMetamask() {
    console.log("Login with Metamask")
  }

  loginWithWebWallet() {
    console.log("Login with WebWallet")
  }

  oauthLogin() {
    this.oauthLoginRequest.emit()
  }
}
