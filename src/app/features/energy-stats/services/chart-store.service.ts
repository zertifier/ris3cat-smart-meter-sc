import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";
import {DateRange} from "../models/DateRange";

export interface ChartStore {
  dateRange: DateRange,
  date: Date,
  fetchingData: boolean,
}

const defaultValues: ChartStore = {
  dateRange: DateRange.MONTH,
  date: new Date(),
  fetchingData: false,
}

@Injectable({
  providedIn: 'root'
})
export class ChartStoreService extends RxStore<ChartStore>{
  constructor() {
    super(defaultValues);
  }

  public setDate(date: Date) {
    this.patchState({date})
  }

  public setDateRange(dateRange: DateRange) {
    this.patchState({dateRange})
  }

  public fetchingData(fetchingData: boolean) {
    this.patchState({fetchingData});
  }

  public override resetDefaults() {
    this.setState({...defaultValues, date: new Date()})
  }
}
