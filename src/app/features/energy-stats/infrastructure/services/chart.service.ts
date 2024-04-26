import { Injectable } from '@angular/core';
import {ChartStoreService} from "./chart-store.service";
import {DateRange} from "../../domain/DateRange";
import {DatadisEnergyStat} from "../../../../shared/infrastructure/services/zertipower/DTOs/EnergyStatDTO";
import {ChartEntity} from "../../domain/ChartEntity";
import {UserStoreService} from "../../../user/infrastructure/services/user-store.service";
import {ZertipowerService} from "../../../../shared/infrastructure/services/zertipower/zertipower.service";
import {ChartResource} from "../../domain/ChartResource";
import {ChartType} from "../../domain/ChartType";

export interface MappedStatData {
  consumption: number,
  surplus: number,
  virtualSurplus: number,
  production: number,
  communitySurplus: number,
  communitySurplusActive: number
  infoDt: Date,
  activeMembers: number,
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor(
    private readonly chartStoreService: ChartStoreService,
    private readonly userStore: UserStoreService,
    private readonly zertipower: ZertipowerService,
  ) {}

  public latestFetchedStats: MappedStatData[] = []

  public async fetchEnergyStats(date: Date, range: DateRange) {
    this.chartStoreService.snapshotOnly(state => state.origin);
    this.chartStoreService.fetchingData(true);
    let data: DatadisEnergyStat[];
    try {
      const cupId = this.userStore.snapshotOnly(this.userStore.$.cupId);
      const communityId = this.userStore.snapshotOnly(this.userStore.$.communityId);
      const selectedChart = this.chartStoreService.snapshotOnly(state => state.selectedChartEntity);
      if (selectedChart === ChartEntity.CUPS) {
        const response = await this.zertipower.getCupEnergyStats(cupId, 'datadis', date, range);
        this.userStore.patchState({activeMembers: response.totalActiveMembers || 0});
        this.userStore.patchState({totalMembers: response.totalMembers || 0});
        data = response.stats;
      } else {
        if (!communityId) {
          return [];
        }
        const response = await this.zertipower.getCommunityEnergyStats(communityId, 'datadis', date, range);
        this.userStore.patchState({activeMembers: response.totalActiveMembers || 0});
        this.userStore.patchState({totalMembers: response.totalMembers || 0});
        data = response.stats;
      }
      const {selectedChartResource, chartType} = this.chartStoreService.snapshot();
      const showEnergy = selectedChartResource === ChartResource.ENERGY;
      const cce = chartType === ChartType.CCE;
      const mappedData = this.mapStats(data, cce, showEnergy);
      this.latestFetchedStats = mappedData;
      return mappedData;
    } finally {
      this.chartStoreService.fetchingData(false);
    }
  }

  private mapStats(data: DatadisEnergyStat[], cce: boolean, showEnergy: boolean): MappedStatData[] {
    return data.map(d => {
      const consumption = showEnergy ? d.kwhIn : +(d.kwhInPrice * d.kwhIn).toFixed(2);
      const surplus = showEnergy ? d.kwhOut : +(d.kwhOutPrice * d.kwhOut).toFixed(2);
      const communitySurplus = showEnergy ? d.production : +(d.kwhInPrice * d.production).toFixed(2);
      const communitySurplusActive = showEnergy ? d.productionActives : +(d.kwhInPrice * d.productionActives).toFixed(2);
      const virtualSurplus = showEnergy ? d.kwhOutVirtual : +(d.kwhOutPriceCommunity * d.kwhOutVirtual).toFixed(2);
      const production = showEnergy ? d.production : +(d.kwhInPrice * d.production).toFixed(2);

      if (!cce) {
        return {
          consumption,
          surplus,
          virtualSurplus,
          production,
          communitySurplus,
          communitySurplusActive,
          infoDt: d.infoDt,
          activeMembers: d.activeMembers,
        }
      }

      return {
        consumption,
        surplus,
        virtualSurplus,
        production,
        communitySurplus,
        communitySurplusActive,
        infoDt: d.infoDt,
        activeMembers: d.activeMembers,
      }
    });
  }
}
