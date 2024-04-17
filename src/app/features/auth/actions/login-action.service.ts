import { Injectable } from '@angular/core';
import {firstValueFrom} from "rxjs";
import {ethers} from "ethers";
import {AuthStoreService} from "../services/auth-store.service";
import {ZertiauthApiService} from "../services/zertiauth-api.service";
import {ApiService} from "../../../shared/infrastructure/services/api.service";
import {EventBus} from "../../../shared/domain/EventBus";
import {UserLoggedInEvent} from "../domain/UserLoggedInEvent";

@Injectable({
  providedIn: 'root'
})
export class LoginActionService {

  constructor(
    private readonly zertiauthApiService: ZertiauthApiService,
    private readonly apiService: ApiService,
    private readonly authStore: AuthStoreService,
    private readonly eventBus: EventBus,
  ) {}

  async run(oauthCode: string) {
    const response = await firstValueFrom(this.zertiauthApiService.getPrivateKey(oauthCode));
    const wallet = new ethers.Wallet(response.privateKey as string);

    // login
    const tokens = await this.apiService.auth.login(wallet.address, wallet.privateKey, response.email);
    this.authStore.setTokens({refreshToken: tokens.refreshToken, accessToken: tokens.accessToken});
    await this.eventBus.publishEvents(new UserLoggedInEvent());
  }
}
