import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {HttpResponse} from "../../../shared/services/HttpResponse";
import {firstValueFrom, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private httpClient: HttpClient) {
  }

  public async getSignCode(walletAddress: string, email?: string): Promise<string> {
    const response = this.httpClient.post<HttpResponse<{
      signCode: string
    }>>(`${environment.api_url}/auth/users/sign-code`, {walletAddress, email}).pipe(map(r => r.data.signCode));
    return firstValueFrom(response);
  }

  public async login(walletAddress: string, signature: string): Promise<{ accessToken: string, refreshToken: string }> {
    const response = this.httpClient.post<HttpResponse<{
      accessToken: string,
      refreshToken: string
    }>>(`${environment.api_url}/auth/users/w3-login`, {
      walletAddress,
      signature
    }).pipe(map(r => r.data))

    return firstValueFrom(response);
  }
}
