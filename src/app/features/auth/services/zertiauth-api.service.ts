import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {App} from '@zertifier/zertiauthjs';
import {from} from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class ZertiauthApiService {
  baseUrl: string = "https://auth.zertifier.com";
  app = new App("0ba3f4b3-55fa-499f-8782-23c81a2b4652");
  redirectUrl: string = `${window.location.origin}/auth/oauth-callback`;
  constructor(
    private http: HttpClient,
  ) {
  }


  getAuthUrl(platform: 'google' | 'twitter' | 'github') {
    const {baseCode, codeChallenge} = this.app.generateCodeChallenge();
    localStorage.setItem('baseCodeChallenge', baseCode);

    const url = this.app.getAuthUrl(this.redirectUrl, platform, codeChallenge);

    return url
  }

  getPrivateKey(code: string) {
    const baseCode = localStorage.getItem('baseCodeChallenge');
    if (!baseCode) {
      throw new Error('Base code not saved on local storage')
    }
    const response: Promise<{privateKey: string, email: string}> = this.app.getCredentials(code, baseCode);
    return from(response)
  }
}
