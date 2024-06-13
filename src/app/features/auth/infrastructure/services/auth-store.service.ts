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
export const OAUTH_CODE = 'oauthCode';

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

  public removeOauthCode(){
    localStorage.removeItem(OAUTH_CODE);
  }

  public setTokens({refreshToken, accessToken}: { refreshToken: string, accessToken: string }) {
    const decodedToken = this.decodeToken(refreshToken);
    this.patchState({refreshToken, accessToken, authData: decodedToken});
  }

  public saveOauthCode(oauthCode: string){
    localStorage.setItem(OAUTH_CODE, oauthCode);
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

  public getOauthCode(){
    return localStorage.getItem(OAUTH_CODE) || ''
  }
  public override resetDefaults() {
    super.resetDefaults();
    this.removeTokens();
    this.removeOauthCode()
  }
}
