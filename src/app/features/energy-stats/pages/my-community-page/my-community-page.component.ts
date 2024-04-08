import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {NavbarComponent} from "../../../../shared/components/navbar/navbar.component";
import {ChartModule} from "primeng/chart";
import {MonitoringService, PowerStats} from "../../services/monitoring.service";
import {Subscription} from "rxjs";
import {JsonPipe, NgClass, NgStyle} from "@angular/common";
import {StatsColors} from "../../models/StatsColors";
import {StatDisplayComponent} from "../../components/stat-display/stat-display.component";
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {ChartLegendComponent} from "../../components/chart-legend/chart-legend.component";
import {DataChartComponent} from "../../components/data-chart/data-chart.component";
import {
  ConsumptionItem,
  ConsumptionItemsComponent
} from "../../components/consumption-items/consumption-items.component";
import {FooterComponent} from "../../../../shared/components/footer/footer.component";
import {CalendarModule} from "primeng/calendar";
import {ReactiveFormsModule} from "@angular/forms";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import {HistoricChartComponent} from "../../components/historic-chart/historic-chart.component";
import {ZertipowerService} from "../../../../shared/services/zertipower.service";
import {AuthStoreService} from "../../../auth/services/auth-store.service";
import {jwtDecode} from 'jwt-decode';

dayjs.extend(utc);

@Component({
  selector: 'app-my-community-page',
  standalone: true,
  imports: [
    NavbarComponent,
    ChartModule,
    JsonPipe,
    NgStyle,
    StatDisplayComponent,
    NgbNavOutlet,
    NgbNav,
    NgbNavItem,
    NgbNavLinkButton,
    NgbNavContent,
    ChartLegendComponent,
    DataChartComponent,
    ConsumptionItemsComponent,
    FooterComponent,
    NgClass,
    CalendarModule,
    ReactiveFormsModule,
    HistoricChartComponent
  ],
  templateUrl: './my-community-page.component.html',
  styleUrl: './my-community-page.component.scss'
})
export class MyCommunityPageComponent implements OnInit, OnDestroy {
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
  subscriptions: Subscription[] = [];
  protected readonly StatsColors = StatsColors;

  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly zertipower: ZertipowerService,
    private readonly authStore: AuthStoreService
  ) {
    this.monitoringService.start(60000);
  }

  async ngOnInit(): Promise<void> {
    const authData = this.authStore.snapshotOnly(state => state.authData);
    if (!authData) {
      alert('no auth data')
      return;
    }
    const cups = await this.zertipower.getCups(authData.id);

    console.log({cups});

    this.subscriptions.push(
      this.monitoringService
        .getPowerFlow()
        .subscribe(value => {
          const {production, buy, inHouse, sell} = value;
          this.powerFlow.set({
            production: Math.round(production / 10) / 100,
            inHouse: Math.round(inHouse / 10) / 100,
            buy: Math.round(buy / 10) / 100,
            sell: Math.round(sell / 10) / 100,
          })
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
}
