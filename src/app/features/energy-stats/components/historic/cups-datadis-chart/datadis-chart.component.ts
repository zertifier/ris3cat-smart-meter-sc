import {Component, OnInit} from '@angular/core';
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
export class DatadisChartComponent implements OnInit {
  date$ = this.chartStoreService.selectOnly(state => state.date);
  fetchingData$ = this.chartStoreService.selectOnly(state => state.fetchingData);
  cupIds$ = this.userStore.selectOnly(state => state.cupIds);

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
    this.cupIds$.subscribe(async cups => {
      const [date, dateRange] = this.chartStoreService.snapshotOnly(state => [state.date, state.dateRange]);
      const data = await this.fetchEnergyStats(date, dateRange);
      this.setDataChart(data, dateRange);
    });

    this.date$.subscribe(async date => {
      const dateRange = this.chartStoreService.snapshotOnly(state => state.dateRange);
      const data = await this.fetchEnergyStats(date, dateRange);
      this.setDataChart(data, dateRange);
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
   */
  setDataChart(data: DatadisEnergyStat[], range: DateRange) {
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

    this.data = {
      labels,
      datasets: [
        {
          label: 'Consum',
          backgroundColor: StatsColors.BUY_CONSUMPTION,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.kwhIn),
          stack: 'Stack 1'
        },
        {
          label: 'Excedent',
          backgroundColor: StatsColors.SELL,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.kwhOut),
          stack: 'Stack 2'
        }
      ]
    }
  }
}
