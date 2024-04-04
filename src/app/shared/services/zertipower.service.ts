import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpResponse} from "./HttpResponse";
import {firstValueFrom, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ZertipowerService {

  private BASE_URL = 'https://api-dev-ris3cat.zertifier.com';

  constructor(private httpClient: HttpClient) {
  }

  async getUsers(criteria: any): Promise<any[]> {
    const params = new HttpParams().set('criteria', criteria);
    const response = this.httpClient.get<HttpResponse<any[]>>(`${this.BASE_URL}/users`, {
      params
    }).pipe(map(r => r.data));

    return firstValueFrom(response);

  }

  async getSignCode(walletAddress: string): Promise<string> {
    const response = this.httpClient.post<HttpResponse<{
      code: string
    }>>(`${this.BASE_URL}/auth/request-code`, {wallet_address: walletAddress})
      .pipe(map(r => r.data.code));

    return firstValueFrom(response);
  }

  async login(walletAddress: string, signature: string, email: string): Promise<{
    accessToken: string,
    refreshToken: string
  }> {
    const response = this.httpClient.post<HttpResponse<{
      access_token: string,
      refresh_token: string
    }>>(`${this.BASE_URL}/auth/login-w3`, {wallet_address: walletAddress, signature, email})
      .pipe(map(r => ({accessToken: r.data.access_token, refreshToken: r.data.refresh_token})));

    return firstValueFrom(response);
  }

  async createUser(wallet: string, email: string) {

  }
}
