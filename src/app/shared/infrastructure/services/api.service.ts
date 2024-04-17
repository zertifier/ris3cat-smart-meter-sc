import { Injectable } from '@angular/core';
import {AuthApiService} from "../../../features/auth/infrastructure/services/auth-api.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public readonly auth: AuthApiService,
  ) {}
}
