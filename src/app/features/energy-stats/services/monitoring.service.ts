import {Injectable} from '@angular/core';
import {firstValueFrom, map, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HttpResponse} from "../../auth/services/zertiauth-api.service";

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
    }>>("http://localhost:3000/monitoring/powerflow/").pipe(map(r => r.data)))
      .then(data => this.powerFlow.next(data));

    this.interval = setInterval(async () => {
      const data = await firstValueFrom(this.httpClient.get<HttpResponse<{
        production: number,
        consumption: number,
        grid: number
      }>>("http://localhost:3000/monitoring/powerflow/")
        .pipe(map(r => r.data)));

      this.powerFlow.next(data);
    }, interval);
  }


  getPowerFlow() {
    return this.powerFlow.asObservable();
  }

  stop() {
    clearInterval(this.interval);
  }
}
