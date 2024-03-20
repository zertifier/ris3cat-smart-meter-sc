import {Injectable} from '@angular/core';
import {firstValueFrom, map, Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpResponse} from "../../auth/services/zertiauth-api.service";
import {environment} from "../../../../environments/environment";
import {producerAccessed} from "@angular/core/primitives/signals";

export interface EnergyStat {
  inHouseConsumption: number;
  sell: number;
  buy: number;
  date: Date;
}

export interface PowerStats {
  production: number;
  inHouse: number;
  buy: number;
  sell: number;
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
      .then(data => {
        const stats: PowerStats = {buy: 0,sell: 0,inHouse: 0, production: 0}
        stats.production = data.production
        if (data.consumption > data.production) {
          stats.inHouse = data.production;
          stats.buy = data.consumption - data.production
        } else {
          stats.inHouse = data.consumption;
          stats.sell = data.production - data.consumption
        }
        this.powerFlow.next(stats)
      });

    this.interval = setInterval(async () => {
      const data = await firstValueFrom(this.httpClient.get<HttpResponse<{
        production: number,
        consumption: number,
        grid: number
      }>>(`${environment.api_url}/monitoring/powerflow/`)
        .pipe(map(r => r.data)));

      const stats: PowerStats = {buy: 0,sell: 0,inHouse: 0, production: 0}
      stats.production = data.production
      if (data.consumption > data.production) {
        stats.inHouse = data.production;
        stats.buy = data.consumption - data.production
      } else {
        stats.inHouse = data.consumption;
        stats.sell = data.production - data.consumption
      }
      this.powerFlow.next(stats)
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
