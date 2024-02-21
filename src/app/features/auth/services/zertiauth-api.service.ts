import {afterRender, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SHA256} from 'crypto-js'

export interface HttpResponse {
  message: string,
  success: boolean,
  data: object
}

export interface PrivateKeyHttpResponse extends HttpResponse {
  data: privateKeyObject;
}

export interface privateKeyObject{
  privateKey: string
}

@Injectable({
  providedIn: 'root'
})
export class ZertiauthApiService {
  baseUrl: string = "https://auth.zertifier.com"
  appId: string = "ca6e1e8e-4bcf-42d3-9bf3-f6d3c21dd0d9" //CHANGE IT TO YOUR APP ID
  redirectUrl: string = ''
  constructor(
    private http: HttpClient,
  ) {
    afterRender(() => {
      this.redirectUrl = window.location.origin;
    })
  }


  getCode(platform: 'google' | 'twitter' | 'facebook' | 'linkedin' | 'github') {
    const baseCode = this.generateRandomString(32)
    localStorage.setItem('baseCodeChallenge', baseCode);

    const codeChallenge = SHA256(baseCode).toString();

    const url =
      `${this.baseUrl}/zauth/oauth/${platform}?app-id=${this.appId}&redirect-url=${this.redirectUrl}&code-challenge=${codeChallenge}&code-challenge-method=S256`

    return url
  }

  getPrivateKey(code: string) {
    const url = `${this.baseUrl}/zauth/web3/credentials/`
    const body = {
      code,
      codeVerifier: localStorage.getItem('baseCodeChallenge')
    }
    return this.http.post<PrivateKeyHttpResponse>(url, body)

  }

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomChars = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length)));

    return randomChars.join('');;
  }
}
