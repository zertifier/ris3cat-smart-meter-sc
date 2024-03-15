import {Injectable} from '@angular/core';
import {firstValueFrom, map, Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpResponse} from "../../auth/services/zertiauth-api.service";
import {environment} from "../../../../environments/environment";

export interface EnergyStat {
  inHouseConsumption: number;
  sell: number;
  buy: number;
  date: Date;
}

export interface PowerStats {
  production: number;
  consumption: number;
  grid: number;
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private powerFlow = new Subject<PowerStats>();
  private interval?: number;

  constructor(private httpClient: HttpClient) {
  }

  start(interval: number) {
    if (this.interval) {
      this.stop()
    }
    firstValueFrom(this.httpClient.get<HttpResponse<{
      production: number,
      consumption: number,
      grid: number
    }>>(`${environment.api_url}/monitoring/powerflow/`).pipe(map(r => r.data)))
      .then(data => this.powerFlow.next(data));

    this.interval = setInterval(async () => {
      const data = await firstValueFrom(this.httpClient.get<HttpResponse<{
        production: number,
        consumption: number,
        grid: number
      }>>(`${environment.api_url}/monitoring/powerflow/`)
        .pipe(map(r => r.data)));

      this.powerFlow.next(data);
    }, interval);
  }


  getPowerFlow() {
    return this.powerFlow.asObservable();
  }

  async getEnergyStats(date: string, dateRange: number) {
    const params = new HttpParams().set('date', date).set('daterange', dateRange)
    return await firstValueFrom(this.httpClient.get<EnergyStat[]>(`${environment.api_url}/monitoring/energystats`, {
      params
    }));
  }

  stop() {
    clearInterval(this.interval);
  }
}
