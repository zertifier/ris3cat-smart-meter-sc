import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";
import {jwtDecode, JwtPayload} from 'jwt-decode';

export interface AuthState {
  accessToken: string;
  refreshToken: string;
  authData?: {
    id: number;
    firstname: string;
    email: string;
    username: string;
    wallet_address: string;
    role: string;
  }
}

const defaultValues: AuthState = {
  accessToken: '',
  refreshToken: '',
}

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService extends RxStore<AuthState> {
  readonly $ = {
    loggedIn: (state: AuthState) => !!state.refreshToken
  }

  constructor() {
    super(defaultValues);
    const accessToken = localStorage.getItem(ACCESS_TOKEN) || '';
    const refreshToken = localStorage.getItem(REFRESH_TOKEN) || '';

    if (!refreshToken) {
      this.removeTokens();
      return;
    }

    this.setTokens({accessToken, refreshToken});
  }

  public removeTokens() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    this.patchState({accessToken: '', refreshToken: '', authData: undefined})
  }

  public setTokens({refreshToken, accessToken}: { refreshToken: string, accessToken: string }) {
    const decodedToken = this.decodeToken(refreshToken);
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    this.patchState({refreshToken, accessToken, authData: decodedToken});
  }

  private decodeToken(refreshToken: string) {
    return jwtDecode(refreshToken) as JwtPayload & {
      id: number;
      firstname: string;
      email: string;
      username: string;
      wallet_address: string;
      role: string;
    };
  }

  public override resetDefaults() {
    super.resetDefaults();
    this.removeTokens();
  }
}
