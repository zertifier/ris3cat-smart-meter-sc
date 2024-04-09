import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpResponse} from "../HttpResponse";
import {firstValueFrom, map} from "rxjs";
import axios from "axios";
import {SKIP_AUTH_INTERCEPTOR} from "../../../features/auth/interceptors/auth-token.interceptor";
import {AuthStoreService} from "../../../features/auth/services/auth-store.service";
import {LegacyCriteria} from "../../LegacyCriteria";
import {UserResponseDTO} from "./DTOs/UserResponseDTO";
import {DatadisEnergyStat, EnergyStatDTO} from "./DTOs/EnergyStatDTO";
import dayjs from "dayjs";
import {environment} from "../../../../environments/environment";
import {DateRange} from "../../../features/energy-stats/models/DateRange";
import {CupsResponseDTO} from "./DTOs/CupsResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class ZertipowerService {

  private BASE_URL = environment.zertipower_url;
  private axiosClient = axios.create({
    baseURL: this.BASE_URL,
  })

  // Note, the usage of axios is because it can parse the criteria object and send it correctly.
  // Angular http client cannot do that.
  constructor(
    private httpClient: HttpClient,
    private readonly authStore: AuthStoreService
  ) {
    // Implementing auth token interceptor
    this.axiosClient.interceptors.request.use((config) => {
      if (config.headers.has(SKIP_AUTH_INTERCEPTOR)) {
        config.headers.delete(SKIP_AUTH_INTERCEPTOR);
        return config;
      }

      const accessToken = this.authStore.snapshotOnly(state => state.accessToken);
      config.headers.delete(SKIP_AUTH_INTERCEPTOR);
      config.headers.set('Auhtorization', `Bearer ${accessToken}`);

      return config;
    });
  }

  async getCups(id: number): Promise<CupsResponseDTO[]> {
    return firstValueFrom(
      this.httpClient.get<HttpResponse<any>>(`${this.BASE_URL}/users/${id}/cups`)
        .pipe(map(r => r.data))
    );
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


  async getUsers(criteria: LegacyCriteria) {
    const response = await this.axiosClient.get<HttpResponse<UserResponseDTO[]>>("/users", {params: {criteria}});
    return response.data.data;
  }

  async getEnergyStats(cupId: number, source: string, date: Date, dateRange: DateRange): Promise<DatadisEnergyStat[]> {
    let range: string;
    let desiredFormat: string
    switch (dateRange) {
      case DateRange.DAY:
        desiredFormat = 'YYYY-MM-DD'
        range = 'daily'
        break;
      case DateRange.MONTH:
        desiredFormat = 'YYYY-MM'
        range = 'monthly'
        break;
      case DateRange.YEAR:
        desiredFormat = 'YYYY'
        range = 'yearly'
        break;
    }
    const formattedDate = dayjs(date).format(desiredFormat); // TODO use dayjs to format date
    const response = await this.axiosClient.get<HttpResponse<EnergyStatDTO[]>>(`/cups/${cupId}/stats/${source}/${range}/${formattedDate}`);
    return response.data.data.map(r => ({
      ...r,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
      infoDt: new Date(r.infoDt),
    }));
  }
}
