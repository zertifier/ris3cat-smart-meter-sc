import {Injectable} from '@angular/core';
import {ACCESS_TOKEN, AuthStoreService, OAUTH_CODE, REFRESH_TOKEN} from "./auth-store.service";
import {EventBus} from "../../../../shared/domain/EventBus";
import {UserLoggedInEvent} from "../../domain/UserLoggedInEvent";

@Injectable({
  providedIn: 'root'
})
export class AuthPersistenceProxyService {
  constructor(
    private authStore: AuthStoreService,
    private eventBus: EventBus
  ) {}

  init(): void {
    const accessToken = localStorage.getItem(ACCESS_TOKEN) || '';
    const refreshToken = localStorage.getItem(REFRESH_TOKEN) || '';
    const oauthCode = localStorage.getItem(OAUTH_CODE) || '';

    if (!refreshToken) {
      this.authStore.removeTokens();
      this.authStore.removeOauthCode()
      return;
    }

    this.authStore.setTokens({accessToken, refreshToken});
    this.authStore.saveOauthCode(oauthCode)

    this.eventBus.publishEvents(new UserLoggedInEvent());
  }
}
