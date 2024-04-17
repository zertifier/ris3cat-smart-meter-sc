import {Injectable, OnInit} from '@angular/core';
import {ACCESS_TOKEN, AuthStoreService, REFRESH_TOKEN} from "./auth-store.service";
import {EventBus} from "../../../shared/domain/EventBus";
import {UserLoggedInEvent} from "../domain/UserLoggedInEvent";

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

    if (!refreshToken) {
      this.authStore.removeTokens();
      return;
    }

    this.authStore.setTokens({accessToken, refreshToken});
    this.eventBus.publishEvents(new UserLoggedInEvent());
  }

}
