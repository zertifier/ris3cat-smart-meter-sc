import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {NavbarComponent} from "../../../../shared/components/navbar/navbar.component";
import {ChartModule} from "primeng/chart";
import {EnergyStat, MonitoringService, PowerStats} from "../../services/monitoring.service";
import {Subscription} from "rxjs";
import {JsonPipe, NgStyle} from "@angular/common";
import dayjs from "dayjs";
import {producerAccessed} from "@angular/core/primitives/signals";
import {StatsColors} from "../../models/StatsColors";
import {StatDisplayComponent} from "../../components/stat-display/stat-display.component";
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {ChartLegendComponent, DataLabel} from "../../components/chart-legend/chart-legend.component";
import {DataChartComponent} from "../../components/data-chart/data-chart.component";

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
    DataChartComponent
  ],
  templateUrl: './my-community-page.component.html',
  styleUrl: './my-community-page.component.scss'
})
export class MyCommunityPageComponent implements OnInit, OnDestroy {
  data: any
  readonly powerFlow = signal<PowerStats>({production: 0, buy: 0, inHouse: 0, sell: 0})
  fetchingData = false;
  chartLabels: DataLabel[] = [
    {
      color: StatsColors.BUY_CONSUMPTION,
      label: 'Consum',
      radius: '2.5rem',
    },
    {
      color: StatsColors.IN_HOUSE_CONSUMPTION,
      label: 'Autoconsum',
      radius: '2.5rem',
    },
    {
      color: StatsColors.PRODUCTION,
      label: 'Producció',
      radius: '2.5rem',
    },
    {
      color: StatsColors.SELL,
      label: 'Excedent',
      radius: '2.5rem',
    }
  ];

  subscriptions: Subscription[] = [];

  constructor(private readonly monitoringService: MonitoringService) {
    this.monitoringService.start(5000);
  }

  async ngOnInit(): Promise<void> {
    let subscription = this.monitoringService
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

    this.subscriptions.push(subscription);


    this.fetchingData = true;
    let data: EnergyStat[];
    try {
      data = await this.monitoringService.getEnergyStats('2023-12-01', 3);
    } finally {
      this.fetchingData = false;
    }


    this.data = {
      // labels: data.map(d => dayjs(d.date).format("YYYY-MM")),
      labels: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
      datasets: [
        {
          label: 'Produccio',
          backgroundColor: StatsColors.PRODUCTION,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.sell + d.inHouseConsumption),
          stack: 'Stack 0'
        },
        {
          label: 'Consum de la xarxa electrica',
          backgroundColor: StatsColors.BUY_CONSUMPTION,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.buy),
          stack: 'Stack 1'
        },
        {
          label: 'Consum propi',
          backgroundColor: StatsColors.IN_HOUSE_CONSUMPTION,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.inHouseConsumption),
          stack: 'Stack 1'
        },
        {
          label: 'Venta energetica',
          backgroundColor: StatsColors.SELL,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.sell),
          stack: 'Stack 2'
        }
      ]
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    })
  }

  protected readonly StatsColors = StatsColors;
  protected readonly Component = Component;
}
