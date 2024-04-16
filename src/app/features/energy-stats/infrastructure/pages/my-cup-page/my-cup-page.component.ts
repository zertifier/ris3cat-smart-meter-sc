import {Component, OnInit, signal} from '@angular/core';
import {NavbarComponent} from "../../../../../shared/components/navbar/navbar.component";
import {ChartModule} from "primeng/chart";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {MonitoringService, PowerStats} from "../../services/monitoring.service";
import {StatsColors} from "../../../domain/StatsColors";
import {FooterComponent} from "../../../../../shared/components/footer/footer.component";
import {CalendarModule} from "primeng/calendar";
import {ReactiveFormsModule} from "@angular/forms";
import {UserStoreService} from "../../../../user/services/user-store.service";
import {ChartLegendComponent} from "../../components/historic/chart-legend/chart-legend.component";
import {DataChartComponent} from "../../components/historic/data-chart/data-chart.component";
import {StatDisplayComponent} from "../../components/realtime/stat-display/stat-display.component";
import {
  ConsumptionItem,
  ConsumptionItemsComponent
} from "../../components/realtime/consumption-items/consumption-items.component";
import {HistoricChartComponent} from "../../components/historic/historic-chart/historic-chart.component";
import {QuestionBadgeComponent} from "../../../../../shared/components/question-badge/question-badge.component";
import {Subscription} from "rxjs";


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
    QuestionBadgeComponent
  ],
  templateUrl: './my-cup-page.component.html',
  styleUrl: './my-cup-page.component.scss'
})
export class MyCupPageComponent implements OnInit {
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
  protected readonly StatsColors = StatsColors;
  cupsReference$ = this.userStore.selectOnly(this.userStore.$.cupsReference);
  surplusDistribution$ = this.userStore.selectOnly(state => state.surplusDistribution);
  subscriptions: Subscription[] = [];

  constructor(private readonly monitoringService: MonitoringService, private readonly userStore: UserStoreService) {
    this.monitoringService.start(60000);
  }

  ngOnInit(): void {
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

}
