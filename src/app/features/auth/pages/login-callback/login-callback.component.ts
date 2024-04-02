import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ZertiauthApiService} from "../../services/zertiauth-api.service";
import {firstValueFrom} from "rxjs";
import {ethers} from "ethers";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../shared/services/api.service";

@Component({
  selector: 'app-login-callback',
  standalone: true,
  imports: [],
  templateUrl: './login-callback.component.html',
  styleUrl: './login-callback.component.scss'
})
export class LoginCallbackComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private zertiauthApiService: ZertiauthApiService,
    private httpClient: HttpClient,
    private apiService: ApiService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    const params = this.route.snapshot.queryParams;
    const code: string = params['code'];

    if (!code) {
      throw new Error('Code not received from oauth');
    }

    const response = await firstValueFrom(this.zertiauthApiService.getPrivateKey(code));
    const email = response.email;
    const wallet = new ethers.Wallet(response.privateKey as string);

    // request sign code
    const signCode = await this.apiService.auth.getSignCode(wallet.address, email);
    // login
    const signature = await wallet.signMessage(signCode);
    const tokens = await this.apiService.auth.login(wallet.address, signature);
    console.log(tokens);
    this.router.navigate(['/energy-stats']);
  }
}
