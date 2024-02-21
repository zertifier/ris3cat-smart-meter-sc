import { Component } from '@angular/core';

@Component({
  selector: 'app-web-wallet-login',
  standalone: true,
  imports: [],
  templateUrl: './web-wallet-login.component.html',
  styleUrl: './web-wallet-login.component.scss'
})
export class WebWalletLoginComponent {
  constructor(
  ) {
  }

  loginWithMetamask() {
    console.log("Login with Metamask")
  }

  loginWithWebWallet() {
    console.log("Login with WebWallet")
  }
}
