import {Injectable} from '@angular/core';
import {ACCESS_TOKEN, AuthStoreService, REFRESH_TOKEN} from "./auth-store.service";
import {EventBus} from "@shared/domain/EventBus";
import {UserLoggedInEvent} from "../../domain/UserLoggedInEvent";

/**
 * AuthPersistenceProxyService is the responsible to sync local storage with auth store.
 * Every change to auth store related to auth tokens will be reflected to the localstorage.
 *
 * When the proxy inits checks for auth tokens and login if there are present.
 *
 * Login means update auth store and emit the corresponding event to start getting user info.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthPersistenceProxyService {
  constructor(
    private authStore: AuthStoreService,
    private eventBus: EventBus
  ) {}

  init(): void {
    // Every time auth tokens are updated local storage will be updated
    this.authStore.addInterceptor(state => {
      localStorage.setItem(ACCESS_TOKEN, state.accessToken);
      localStorage.setItem(REFRESH_TOKEN, state.refreshToken);
      return state;
    })

    this.restoreSession();
  }

  private restoreSession() {
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
