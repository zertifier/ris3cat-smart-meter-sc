import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {

  constructor(private httpClient: HttpClient) {
  }

  getPowerFlow() {
    return this.httpClient.get<any>("http://localhost:3000/monitoring/powerflow")
  }
}
