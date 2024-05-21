import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";

export interface MonitoringStore {
  lastPowerFlowUpdate?: Date,
}

const defaultValues: MonitoringStore = {}

@Injectable({
  providedIn: 'root'
})
export class MonitoringStoreService extends RxStore<MonitoringStore> {

  constructor() {
    super(defaultValues);
  }
}
