import {Component, computed, OnInit, signal} from '@angular/core';
import {ChartModule} from "primeng/chart";
import {AsyncPipe, JsonPipe, NgStyle} from "@angular/common";
import {MonitoringService, PowerStats} from "../../services/monitoring.service";
import {StatsColors} from "../../../domain/StatsColors";
import {CalendarModule} from "primeng/calendar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserStoreService} from "../../../../user/infrastructure/services/user-store.service";
import {ChartLegendComponent} from "../../components/historic/chart-legend/chart-legend.component";
import {DataChartComponent} from "../../components/historic/data-chart/data-chart.component";
import {StatDisplayComponent} from "../../components/realtime/stat-display/stat-display.component";
import {
  ConsumptionItem,
  ConsumptionItemsComponent
} from "../../components/realtime/consumption-items/consumption-items.component";
import {HistoricChartComponent} from "../../components/historic/historic-chart/historic-chart.component";
import {map, Subscription} from "rxjs";
import {NavbarComponent} from "../../../../../shared/infrastructure/components/navbar/navbar.component";
import {FooterComponent} from "../../../../../shared/infrastructure/components/footer/footer.component";
import {
  QuestionBadgeComponent
} from "../../../../../shared/infrastructure/components/question-badge/question-badge.component";
import {MonitoringStoreService} from "../../services/monitoring-store.service";
import {getMonth} from "../../../../../shared/utils/DatesUtils";
import dayjs from "dayjs";
import {KnobModule} from "primeng/knob";


@Component({
  selector: 'app-my-cup-page',
  standalone: true,
  imports: [
    NavbarComponent,
    ChartModule,
    JsonPipe,
    ChartLegendComponent,
    DataChartComponent,
    StatDisplayComponent,
    ConsumptionItemsComponent,
    FooterComponent,
    CalendarModule,
    ReactiveFormsModule,
    HistoricChartComponent,
    AsyncPipe,
    QuestionBadgeComponent,
    KnobModule,
    NgStyle,
    FormsModule
  ],
  templateUrl: './my-cup-page.component.html',
  styleUrl: './my-cup-page.component.scss'
})
export class MyCupPageComponent implements OnInit {
  lastUpdate$ = this.monitoringStore.selectOnly(state => state.lastPowerFlowUpdate)
    .pipe(map(value => {
      if (!value) {
        return '';
      }
      const month = getMonth(value.getMonth());
      return dayjs(value).format(`HH:mm:ss - DD [${month}] YYYY`);
    }));
  consumptionItems: ConsumptionItem[] = [
    {
      consumption: 0.015,
      label: 'LED',
      icon: 'fa-solid fa-lightbulb',
    },
    {
      consumption: 0.6,
      label: 'Nevera',
      icon: 'fa-solid fa-temperature-low',
    },
    {
      consumption: 0.25,
      label: 'TV',
      icon: 'fa-solid fa-tv',
    },
    {
      consumption: 0.5,
      label: 'Rentadora',
      icon: 'fa-solid fa-shirt',
    },
    {
      consumption: 2,
      label: 'Estufa',
      icon: 'fa-solid fa-fire-burner',
    },
    {
      consumption: 7,
      label: 'Cotxe elèctric',
      icon: 'fa-solid fa-car',
    },
  ];
  readonly powerFlow = signal<PowerStats>({production: 0, buy: 0, inHouse: 0, sell: 0})
  readonly knobValue = computed(() => {
    const consumptionRatio = (this.powerFlow().sell * 100) / this.powerFlow().production;
    if (isNaN(consumptionRatio)) {
      return '0 %';
    }

    return `${consumptionRatio.toFixed(0)} %`;
  });
  protected readonly StatsColors = StatsColors;
  cupsReference$ = this.userStore.selectOnly(this.userStore.$.cupsReference);
  cups$ = this.userStore.selectOnly(state => state.cups);
  selectedCupsIndex$ = this.userStore.selectOnly(state => state.selectedCupsIndex);
  surplusDistribution$ = this.userStore.selectOnly(state => state.surplusDistribution);
  subscriptions: Subscription[] = [];

  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly userStore: UserStoreService,
    private readonly monitoringStore: MonitoringStoreService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.monitoringService.start();

    this.subscriptions.push(
      this.monitoringService
        .getPowerFlow()
        .subscribe(value => {
          const surplusDistribution = this.userStore.snapshotOnly(state => state.surplusDistribution) / 100;
          const {production, buy, inHouse, sell} = value;
          this.powerFlow.set({
            production: production * surplusDistribution / 1000,
            inHouse: inHouse * surplusDistribution / 1000,
            buy: buy * surplusDistribution / 1000,
            sell: sell * surplusDistribution / 1000,
          })
        })
    )
  }

  selectCups(event: any) {
    const value: number = event.target.value;
    this.userStore.patchState({selectedCupsIndex: value});
  }

}
