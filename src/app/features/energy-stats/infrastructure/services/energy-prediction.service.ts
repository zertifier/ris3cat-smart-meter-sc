import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {HttpResponse} from "@shared/infrastructure/services/HttpResponse";
import {firstValueFrom, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EnergyPredictionService {

  constructor(private httpClient: HttpClient) {
  }

  async getPrediction(): Promise<{value: number, time: string}[]> {
    const response = this.httpClient.get<HttpResponse<{
      value: number,
      time: string
    }[]>>(`${environment.zertipower_url}/energy-prediction`).pipe(map(r => r.data));

    return firstValueFrom(response);
  }
}
