import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ChartLegendComponent, DataLabel} from "../chart-legend/chart-legend.component";
import {DataChartComponent} from "../data-chart/data-chart.component";
import dayjs from "dayjs";
import {Subscription} from "rxjs";
import {StatsColors} from "../../../../domain/StatsColors";
import {ChartStoreService} from "../../../services/chart-store.service";
import {ZertipowerService} from "../../../../../../shared/services/zertipower/zertipower.service";
import {UserStoreService} from "../../../../../user/services/user-store.service";
import {ChartResource} from "../../../../domain/ChartResource";
import {ChartEntity} from "../../../../domain/ChartEntity";
import {DateRange} from "../../../../domain/DateRange";
import {DatadisEnergyStat} from "../../../../../../shared/services/zertipower/DTOs/EnergyStatDTO";
import {ChartType} from "../../../../domain/ChartType";

@Component({
  selector: 'app-datadis-chart',
  standalone: true,
  imports: [
    AsyncPipe,
    ChartLegendComponent,
    DataChartComponent
  ],
  templateUrl: './datadis-chart.component.html',
  styleUrl: './datadis-chart.component.scss'
})
export class DatadisChartComponent implements OnInit, OnDestroy {
  date$ = this.chartStoreService.selectOnly(state => state.date);
  fetchingData$ = this.chartStoreService.selectOnly(state => state.fetchingData);
  cupIds$ = this.userStore.selectOnly(state => state.cupIds);
  subscriptions: Subscription[] = [];

  cupsLabels: DataLabel[] = [
    {
      color: StatsColors.BUY_CONSUMPTION,
      label: 'Consum',
      radius: '2.5rem',
    },
    {
      color: StatsColors.SURPLUS,
      label: 'Excedent',
      radius: '2.5rem',
    },
    {
      color: StatsColors.VIRTUAL_SURPLUS,
      label: 'Excedent virtual',
      radius: '2.5rem',
    }
  ]

  communitiesLabels: DataLabel[] = [
    {
      color: StatsColors.COMMUNITY_PRODUCTION,
      label: 'Excedent comunitari',
      radius: '2.5rem',
    },
    {
      color: StatsColors.ACTIVE_COMMUNITY_PRODUCTION,
      label: 'Excedent actiu comunitari',
      radius: '2.5rem',
    },
    {
      color: StatsColors.BUY_CONSUMPTION,
      label: 'Consum actius',
      radius: '2.5rem',
    },
    {
      color: StatsColors.SURPLUS,
      label: 'Excedent',
      radius: '2.5rem',
    },
    {
      color: StatsColors.VIRTUAL_SURPLUS,
      label: 'Excedent virtual',
      radius: '2.5rem',
    }
  ]

  chartLabels: DataLabel[] = [];
  data: any;

  constructor(
    private readonly chartStoreService: ChartStoreService,
    private readonly zertipower: ZertipowerService,
    private readonly userStore: UserStoreService,
  ) {
    this.userStore.selectOnly(state => state.cupIds).subscribe(console.log)
  }

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(
      this.chartStoreService
        .selectOnly(this.chartStoreService.$.justData)
        .subscribe(async ({
                            date,
                            dateRange,
                            selectedChartResource,
                            selectedChartEntity
                          }) => {
          const data = await this.fetchEnergyStats(date, dateRange);
          this.setDataChart(data, dateRange, selectedChartResource);
          this.chartLabels = [];

          if (selectedChartResource === ChartResource.PRICE) {
            this.chartLabels.push({
              label: 'Estalvi',
              radius: '2.5rem',
              color: StatsColors.COMMUNITY_PRODUCTION,
            })
          }

          if (selectedChartEntity === ChartEntity.CUPS || selectedChartResource === ChartResource.PRICE) {
            this.chartLabels.push(...this.cupsLabels);
          } else {
            this.chartLabels.push(...this.communitiesLabels);
          }


        }),
    );
  }

  async fetchEnergyStats(date: Date, range: DateRange) {
    this.chartStoreService.snapshotOnly(state => state.origin);
    this.chartStoreService.fetchingData(true);
    let data: DatadisEnergyStat[];
    try {
      const [cupId] = this.userStore.snapshotOnly(state => state.cupIds);
      const communityId = this.userStore.snapshotOnly(state => state.communityId);
      const selectedChart = this.chartStoreService.snapshotOnly(state => state.selectedChartEntity);
      if (selectedChart === ChartEntity.CUPS) {
        data = await this.zertipower.getCupEnergyStats(cupId, 'datadis', date, range);
      } else {
        if (!communityId) {
          return [];
        }
        data = await this.zertipower.getCommunityEnergyStats(communityId, 'datadis', date, range);
      }
      return data;
    } finally {
      this.chartStoreService.fetchingData(false);
    }
  }

  /**
   * It is responsible to format data to the corresponding objects for the chart and even changes the labels
   * @param data
   * @param range
   * @param resource
   */
  setDataChart(data: DatadisEnergyStat[], range: DateRange, resource: ChartResource) {
    let labels: string[] = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"];
    if (range === DateRange.MONTH) {
      labels = data.map(d => {
        return dayjs(d.infoDt).format('DD');
      });
    } else if (range === DateRange.DAY) {
      labels = data.map(d => {
        return dayjs(d.infoDt).format('HH');
      })
    }

    const showEnergy = resource === ChartResource.ENERGY;
    const addCommunityDataset = this.chartStoreService.snapshotOnly(state => {
      return state.selectedChartEntity === ChartEntity.COMMUNITIES && state.selectedChartResource === ChartResource.ENERGY
    });
    const cec = this.chartStoreService.snapshotOnly(state => state.chartType === ChartType.CCE);
    const mappedData = data.map(d => {
      let consumption = showEnergy ? d.kwhIn : d.kwhInPrice * d.kwhIn;
      let surplus = showEnergy ? d.kwhOut : d.kwhOutPrice * d.kwhOut;
      let virtualSurplus = showEnergy ? d.kwhOutVirtual : d.kwhOutPrice * d.kwhOutVirtual;

      if (!cec) {
        return {
          consumption,
          surplus,
          virtualSurplus
        }
      }

      if (consumption >= virtualSurplus) {
        consumption -= virtualSurplus;
        virtualSurplus = 0;
      } else {
        consumption = 0;
        virtualSurplus -= consumption;
      }

      return {
        consumption,
        surplus,
        virtualSurplus
      }
    })
    const datasets: any[] = [
      {
        label: addCommunityDataset ? 'Consum actius': 'Consum',
        backgroundColor: StatsColors.BUY_CONSUMPTION,
        borderRadius: 10,
        borderWidth: 1,
        data: mappedData.map(d => d.consumption),
        stack: 'Stack 1'
      },
      {
        label: 'Excedent',
        backgroundColor: StatsColors.SURPLUS,
        borderRadius: 10,
        borderWidth: 1,
        data: mappedData.map(d => d.surplus),
        stack: 'Stack 2'
      },
      {
        label: 'Excedent virtual',
        backgroundColor: StatsColors.VIRTUAL_SURPLUS,
        borderRadius: 10,
        borderWidth: 1,
        data: mappedData.map(d => d.virtualSurplus),
      }
    ]

    if (!showEnergy) {
      datasets.unshift({
        label: 'Estalvi',
        backgroundColor: StatsColors.COMMUNITY_PRODUCTION,
        borderRadius: 10,
        borderWidth: 1,
        data: data.map(d => d.kwhOut),
        stack: 'Estalvi',
        grouped: true,
      });
    }

    if (addCommunityDataset) {
      datasets.unshift(
        {
          label: 'Excedent comunitari',
          backgroundColor: StatsColors.COMMUNITY_PRODUCTION,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.communitySurplus),
          stack: 'Excedent',
          grouped: true,
        },
        {
          label: 'Excedent actiu comunitari',
          backgroundColor: StatsColors.ACTIVE_COMMUNITY_PRODUCTION,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.communitySurplusActive),
          stack: 'Excedent actiu',
          grouped: true,
        },
      )
    }
    this.data = {
      labels,
      datasets,
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
