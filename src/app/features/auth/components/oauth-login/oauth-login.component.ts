import {Component} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ZertiauthApiService} from "../../services/zertiauth-api.service";

@Component({
  selector: 'app-oauth-login',
  standalone: true,
  imports: [NgbModule],
  templateUrl: './oauth-login.component.html',
  styleUrl: './oauth-login.component.scss'
})
export class OauthLoginComponent {
  constructor(
    public zertiAuthServ: ZertiauthApiService,
  ) {
  }

  loginWithGoogle() {
    window.location.href = this.zertiAuthServ.getCode('google');
  }

  loginWithTwitter() {
    window.location.href = this.zertiAuthServ.getCode('twitter');
  }

  openWebWalletModal() {

  }
}
