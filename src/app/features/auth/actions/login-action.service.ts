import {Injectable} from '@angular/core';
import {firstValueFrom} from "rxjs";
import {ethers} from "ethers";
import {AuthStoreService} from "../infrastructure/services/auth-store.service";
import {ZertiauthApiService} from "../infrastructure/services/zertiauth-api.service";
import {ApiService} from "../../../shared/infrastructure/services/api.service";
import {EventBus} from "../../../shared/domain/EventBus";
import {UserLoggedInEvent} from "../domain/UserLoggedInEvent";
import {ZertipowerService} from "../../../shared/infrastructure/services/zertipower/zertipower.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginActionService {

  constructor(
    private readonly zertiauthApiService: ZertiauthApiService,
    private readonly apiService: ApiService,
    private readonly authStore: AuthStoreService,
    private readonly eventBus: EventBus,
    private readonly zertipower: ZertipowerService,
    private readonly router: Router,
  ) {
  }

  async run(oauthCode: string): Promise<boolean> {
    this.authStore.patchState({loginTry: true});
    const response = await firstValueFrom(this.zertiauthApiService.getPrivateKey(oauthCode));
    const wallet = new ethers.Wallet(response.privateKey as string);

    // login
    // This service should be separated into two parts.
    // 1. Check if user does not exist

    const users = await this.zertipower.users.get({filters: []});
    if (!users.find(u => u.email === response.email)) {
      // Go to register page
      this.authStore.patchState({loginData: {privateKey: response.privateKey, email: response.email}})
      await this.router.navigate(['/auth/register']);
      return false;
    }
    const tokens = await this.apiService.auth.login(wallet.address, wallet.privateKey, response.email);
    this.authStore.setTokens({refreshToken: tokens.refreshToken, accessToken: tokens.accessToken});
    await this.eventBus.publishEvents(new UserLoggedInEvent());
    this.authStore.patchState({loginTry: false});
    return true;
  }
}
