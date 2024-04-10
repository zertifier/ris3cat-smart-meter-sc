import {Injectable} from '@angular/core';
import {RxStore} from "@zertifier/rx-store";
import {DateRange} from "../models/DateRange";
import {ChartEntity} from "../domain/ChartEntity";
import {ChartResource} from "../domain/ChartResource";

export enum ChartOrigins {
  DATADIS = 'DATADIS',
  INVERSOR = 'INVERSOR',
  SMART_METER = 'SMART_METER'
}

export interface ChartStore {
  dateRange: DateRange,
  date: Date,
  fetchingData: boolean,
  origin: ChartOrigins,
  selectedChartEntity: ChartEntity,
  selectedChartResource: ChartResource
}

const defaultValues: ChartStore = {
  dateRange: DateRange.MONTH,
  date: new Date(),
  fetchingData: false,
  origin: ChartOrigins.DATADIS,
  selectedChartEntity: ChartEntity.CUPS,
  selectedChartResource: ChartResource.ENERGY,
}

@Injectable({
  providedIn: 'root'
})
export class ChartStoreService extends RxStore<ChartStore>{
  constructor() {
    super(defaultValues);
  }

  $ = {
    justData(state: ChartStore) {
      const {dateRange, date, selectedChartResource, origin, selectedChartEntity} = state;
      return {
        dateRange, date, selectedChartResource, origin, selectedChartEntity
      }
    }
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
