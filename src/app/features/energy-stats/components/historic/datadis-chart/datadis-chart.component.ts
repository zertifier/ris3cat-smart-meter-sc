import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ChartLegendComponent, DataLabel} from "../chart-legend/chart-legend.component";
import {DataChartComponent} from "../data-chart/data-chart.component";
import {ChartStoreService} from "../../../services/chart-store.service";
import {StatsColors} from "../../../models/StatsColors";
import {ZertipowerService} from "../../../../../shared/services/zertipower/zertipower.service";
import {DateRange} from "../../../models/DateRange";
import dayjs from "dayjs";
import {DatadisEnergyStat} from "../../../../../shared/services/zertipower/DTOs/EnergyStatDTO";
import {UserStoreService} from "../../../../user/services/user-store.service";
import {ChartEntity} from "../../../domain/ChartEntity";
import {ChartResource} from "../../../domain/ChartResource";
import {Subscription} from "rxjs";

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
  subscription: Subscription[] = [];

  chartLabels: DataLabel[] = [
    {
      color: StatsColors.BUY_CONSUMPTION,
      label: 'Consum',
      radius: '2.5rem',
    },
    {
      color: StatsColors.SELL,
      label: 'Excedent',
      radius: '2.5rem',
    }
  ];
  data: any;

  constructor(
    private readonly chartStoreService: ChartStoreService,
    private readonly zertipower: ZertipowerService,
    private readonly userStore: UserStoreService,
  ) {
    this.userStore.selectOnly(state => state.cupIds).subscribe(console.log)
  }

  async ngOnInit(): Promise<void> {
    this.chartStoreService
      .selectOnly(this.chartStoreService.$.justData)
      .subscribe(async ({
                          date,
                          dateRange,
                          selectedChartResource
                        }) => {
        const data = await this.fetchEnergyStats(date, dateRange);
        this.setDataChart(data, dateRange, selectedChartResource);
      });
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
    this.data = {
      labels,
      datasets: [
        {
          label: 'Consum',
          backgroundColor: StatsColors.BUY_CONSUMPTION,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => (showEnergy ? d.kwhIn : d.kwhInPrice)),
          stack: 'Stack 1'
        },
        {
          label: 'Excedent',
          backgroundColor: StatsColors.SELL,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => (showEnergy ? d.kwhOut : d.kwhOutPrice)),
          stack: 'Stack 2'
        }
      ]
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(s => s.unsubscribe());
  }
}
