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
  };
  loginTry: boolean;
  loginData?: {email: string, privateKey: string};
}

const defaultValues: AuthState = {
  accessToken: '',
  refreshToken: '',
  loginTry: false,
}

export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService extends RxStore<AuthState> {
  readonly $ = {
    loggedIn: (state: AuthState) => !!state.refreshToken
  }

  constructor(
  ) {
    super(defaultValues);
  }

  // TODO move local storage interaction to persistence proxy
  public removeTokens() {
    this.patchState({accessToken: '', refreshToken: '', authData: undefined})
  }

  public setTokens({refreshToken, accessToken}: { refreshToken: string, accessToken: string }) {
    const decodedToken = this.decodeToken(refreshToken);
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
