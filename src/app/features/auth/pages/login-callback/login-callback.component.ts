import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ZertiauthApiService} from "../../services/zertiauth-api.service";
import {firstValueFrom} from "rxjs";
import {ethers} from "ethers";
import {AuthStoreService} from "../../services/auth-store.service";
import {ApiService} from "../../../../shared/infrastructure/services/api.service";
import {LoginActionService} from "../../actions/login-action.service";

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
    private readonly zertiauthApiService: ZertiauthApiService,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly authStore: AuthStoreService,
    private readonly loginAction: LoginActionService,
  ) {
  }

  async ngOnInit() {
    const params = this.route.snapshot.queryParams;
    const code: string = params['code'];

    if (!code) {
      throw new Error('Code not received from oauth');
    }

    await this.loginAction.run(code);
    this.router.navigate(['/energy-stats']);
  }
}
