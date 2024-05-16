import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {ChartLegendComponent, DataLabel} from "../chart-legend/chart-legend.component";
import {ChartDataset, DataChartComponent} from "../data-chart/data-chart.component";
import dayjs from "dayjs";
import {map, Subscription} from "rxjs";
import {StatsColors} from "../../../../domain/StatsColors";
import {ChartStoreService} from "../../../services/chart-store.service";
import {UserStoreService} from "../../../../../user/infrastructure/services/user-store.service";
import {ChartResource} from "../../../../domain/ChartResource";
import {ChartEntity} from "../../../../domain/ChartEntity";
import {DateRange} from "../../../../domain/DateRange";
import {ChartType} from "../../../../domain/ChartType";
import {DatadisEnergyStat} from "../../../../../../shared/infrastructure/services/zertipower/DTOs/EnergyStatDTO";
import {ZertipowerService} from "../../../../../../shared/infrastructure/services/zertipower/zertipower.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  BreakPoints,
  ScreenBreakPointsService
} from "../../../../../../shared/infrastructure/services/screen-break-points.service";

@Component({
  selector: 'app-datadis-chart',
  standalone: true,
  imports: [
    AsyncPipe,
    ChartLegendComponent,
    DataChartComponent,
    NgIf,
    JsonPipe
  ],
  templateUrl: './datadis-chart.component.html',
  styleUrl: './datadis-chart.component.scss'
})
export class DatadisChartComponent implements OnInit, OnDestroy {
  fetchingData$ = this.chartStoreService.selectOnly(state => state.fetchingData);
  subscriptions: Subscription[] = [];
  activeMembers$ = this.userStore.selectOnly(state => state.activeMembers);
  totalMembers$ = this.userStore.selectOnly(state => state.totalMembers);
  showCommunity$ = this.chartStoreService
    .selectOnly(state => state.selectedChartEntity === ChartEntity.COMMUNITIES);

  datasets: ChartDataset[] = [];
  labels: string[] = [];
  legendLabels: DataLabel[] = [];
  mobileLabels: DataLabel[] = [];

  @ViewChild(DataChartComponent) dataChart!: DataChartComponent;
  @ViewChild('secondChart') secondChart!: DataChartComponent;
  @ViewChild('maximizedChart') maximizedChart!: ElementRef;
  @ViewChild('legendModal') legendModal!: ElementRef;

  constructor(
    private readonly chartStoreService: ChartStoreService,
    private readonly userStore: UserStoreService,
    private readonly zertipower: ZertipowerService,
    private readonly ngbModal: NgbModal,
    private readonly breakpointsService: ScreenBreakPointsService,
  ) {
  }

  public maximizeChart() {
    this.ngbModal.open(this.maximizedChart, {fullscreen: true});
  }

  currentBreakpoint$ = this.breakpointsService.observeBreakpoints();

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(
      this.chartStoreService
        .selectOnly(this.chartStoreService.$.params)
        .subscribe(
          async ({
                   date,
                   dateRange,
                   selectedChartResource,
                   selectedChartEntity,
                   chartType,
                 }) => {
            // Every time that params change, fetch data and update chart
            // Fetching data
            const data = await this.fetchEnergyStats(date, dateRange);
            this.chartStoreService.patchState({lastFetchedStats: data});

            // Create labels
            let labels: string[] = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"];
            if (dateRange === DateRange.MONTH) {
              labels = data.map(d => {
                return dayjs(d.infoDt).format('DD');
              });
            } else if (dateRange === DateRange.DAY) {
              labels = data.map(d => {
                return dayjs(d.infoDt).format('HH');
              })
            }

            const cce = chartType === ChartType.CCE;
            const community = selectedChartEntity === ChartEntity.COMMUNITIES;

            // Map data to a more easy to use objects
            const mappedData = this.mapData(data, chartType, selectedChartResource);

            // Create data sets
            const datasets: ChartDataset[] = [
              {
                label: community ? 'Consum actius' : 'Consum',
                data: mappedData.map(d => {
                  if (community) {
                    return d.consumption;
                  }

                  return d.consumption - d.gridConsumption
                }),
                stack: 'Consumption',
                order: 0,
                color: StatsColors.CONSUMPTION
              }
            ];

            if (cce) {
              datasets.push({
                order: 2,
                label: community ? 'Excedent actius compartit' : 'Excedent compartit',
                color: StatsColors.VIRTUAL_SURPLUS,
                data: mappedData.map(d => d.virtualSurplus),
              })
            } else {
              datasets.push({
                order: 2,
                label: community ? 'Excedent actius' : 'Excedent',
                color: StatsColors.SURPLUS,
                data: mappedData.map(d => d.surplus),
                stack: 'Stack 2',
              })
            }

            if (community) {
              datasets.unshift(
                {
                  order: 0,
                  label: 'Producció actius',
                  color: StatsColors.ACTIVE_COMMUNITY_PRODUCTION,
                  data: mappedData.map(d => d.productionActives),
                  stack: 'Excedent',
                },
                {
                  order: 3,
                  color: StatsColors.COMMUNITY_PRODUCTION,
                  label: 'Producció',
                  data: mappedData.map(d => {
                    if (!d.production) {
                      return 0;
                    }
                    return d.production - d.productionActives;
                  }),
                  stack: 'Excedent',
                },
              )
            } else {
              datasets.unshift({
                label: 'Consum xarxa',
                color: StatsColors.SELF_CONSUMPTION,
                data: mappedData.map(d => {
                  return d.gridConsumption
                }),
                stack: 'Consumption',
              })
              datasets.unshift({
                label: 'Producció',
                color: StatsColors.COMMUNITY_PRODUCTION,
                data: mappedData.map(d => d.production),
                stack: 'Production',
              })
            }

            this.labels = labels;
            this.datasets = datasets;
            this.legendLabels = datasets.map((entry, index) => {
              return {
                  label: entry.label,
                  radius: '2.5rem',
                  color: entry.color,
                  hidden: false,
                  toggle: (label) => {
                    this.dataChart.toggleDataset(index);
                    label.hidden = !label.hidden;
                    return label;
                  }
                }
            });

            this.mobileLabels = this.legendLabels.map(d => {
              return {...d, radius: '2.5rem'}
            })
          }),
    );
  }

  public showLegendModal() {
    this.ngbModal.open(this.legendModal, {size: "xl"});
  }

  async fetchEnergyStats(date: Date, range: DateRange) {
    this.chartStoreService.snapshotOnly(state => state.origin);
    this.chartStoreService.fetchingData(true);
    let data: DatadisEnergyStat[];
    try {
      const cupId = this.userStore.snapshotOnly(this.userStore.$.cupId);
      const communityId = this.userStore.snapshotOnly(this.userStore.$.communityId);
      const selectedChart = this.chartStoreService.snapshotOnly(state => state.selectedChartEntity);
      if (selectedChart === ChartEntity.CUPS) {
        const response = await this.zertipower.energyStats.getCupEnergyStats(cupId, 'datadis', date, range);
        this.userStore.patchState({activeMembers: response.totalActiveMembers || 0});
        this.userStore.patchState({totalMembers: response.totalMembers || 0});
        data = response.stats;
      } else {
        if (!communityId) {
          return [];
        }
        const response = await this.zertipower.energyStats.getCommunityEnergyStats(communityId, 'datadis', date, range);
        this.userStore.patchState({activeMembers: response.totalActiveMembers || 0});
        this.userStore.patchState({totalMembers: response.totalMembers || 0});
        data = response.stats;
      }
      // this.latestFetchedStats = data;
      return data;
    } finally {
      this.chartStoreService.fetchingData(false);
    }
  }

  mapData(data: DatadisEnergyStat[], chartType: ChartType, chartResource: ChartResource) {
    const showEnergy = chartResource === ChartResource.ENERGY;
    const cce = chartType === ChartType.CCE;
    return data.map(d => {
      const consumption = showEnergy ? d.kwhIn : +(d.kwhInPrice * d.kwhIn).toFixed(2);
      const surplus = showEnergy ? d.kwhOut : +(d.kwhOutPrice * d.kwhOut).toFixed(2);
      let productionActives = showEnergy ? d.productionActives : +(d.kwhInPrice * d.productionActives).toFixed(2);
      const virtualSurplus = showEnergy ? d.kwhOutVirtual : +(d.kwhOutPriceCommunity * d.kwhOutVirtual).toFixed(2);
      let production = showEnergy ? d.production : +(d.kwhInPrice * d.production).toFixed(2);
      let gridConsumption = consumption - production;
      if (gridConsumption < 0 || isNaN(gridConsumption)) {
        gridConsumption = 0;
      }

      if (production === undefined) {
        production = 0;
      }

      if (productionActives === undefined) {
        productionActives = 0;
      }

      // TODO make calculations for CCE

      return {
        consumption,
        surplus,
        virtualSurplus,
        production,
        productionActives,
        gridConsumption,
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  protected readonly BreakPoints = BreakPoints;
}
