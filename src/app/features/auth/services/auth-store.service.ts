import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";

export interface AuthState {
  accessToken: string;
  refreshToken: string;
}

const defaultValues: AuthState = {
  accessToken: '',
  refreshToken: '',
}

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService extends RxStore<AuthState> {
  constructor() {
    super(defaultValues);
    const accessToken = localStorage.getItem('accessToken') || '';
    const refreshToken = localStorage.getItem('refreshToken') || '';

    this.setTokens(accessToken, refreshToken);
  }

  readonly $ = {
    loggedIn: (state: AuthState) => !!state.refreshToken
  }

  public setTokens(refreshToken: string, accessToken: string) {
    this.patchState({refreshToken, accessToken});
  }
}
