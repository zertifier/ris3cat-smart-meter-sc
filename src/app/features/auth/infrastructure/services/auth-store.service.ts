import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {EventBus} from "../../../../shared/domain/EventBus";

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
    private readonly eventBus: EventBus,
  ) {
    super(defaultValues);

  }

  // TODO move local storage interaction to persistence proxy
  public removeTokens() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    this.patchState({accessToken: '', refreshToken: '', authData: undefined})
  }

  public removeOauthCode(){
    localStorage.removeItem(OAUTH_CODE);
  }

  public setTokens({refreshToken, accessToken}: { refreshToken: string, accessToken: string }) {
    const decodedToken = this.decodeToken(refreshToken);
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
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
