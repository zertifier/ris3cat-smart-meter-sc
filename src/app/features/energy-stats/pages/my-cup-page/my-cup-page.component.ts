import {Component, signal} from '@angular/core';
import {NavbarComponent} from "../../../../shared/components/navbar/navbar.component";
import {ChartModule} from "primeng/chart";
import {JsonPipe} from "@angular/common";
import {EnergyStat, MonitoringService, PowerStats} from "../../services/monitoring.service";
import {Subscription} from "rxjs";
import {ChartLegendComponent, DataLabel} from "../../components/chart-legend/chart-legend.component";
import {DataChartComponent} from "../../components/data-chart/data-chart.component";
import {StatDisplayComponent} from "../../components/stat-display/stat-display.component";
import {StatsColors} from "../../models/StatsColors";
import {
  ConsumptionItem,
  ConsumptionItemsComponent
} from "../../components/consumption-items/consumption-items.component";
import {FooterComponent} from "../../../../shared/components/footer/footer.component";


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
    FooterComponent
  ],
  templateUrl: './my-cup-page.component.html',
  styleUrl: './my-cup-page.component.scss'
})
export class MyCupPageComponent {
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
  coeficient = 0.08;
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
          production: Math.round(production * this.coeficient / 10) / 100,
          inHouse: Math.round(inHouse * this.coeficient / 10) / 100,
          buy: Math.round(buy * this.coeficient / 10) / 100,
          sell: Math.round(sell * this.coeficient / 10) / 100,
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
          data: data.map(d => (d.sell + d.inHouseConsumption) * this.coeficient),
          stack: 'Stack 0'
        },
        {
          label: 'Consum de la xarxa electrica',
          backgroundColor: StatsColors.BUY_CONSUMPTION,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.buy * this.coeficient),
          stack: 'Stack 1'
        },
        {
          label: 'Consum propi',
          backgroundColor: StatsColors.IN_HOUSE_CONSUMPTION,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.inHouseConsumption * this.coeficient),
          stack: 'Stack 1'
        },
        {
          label: 'Excedent',
          backgroundColor: StatsColors.SELL,
          borderRadius: 10,
          borderWidth: 1,
          data: data.map(d => d.sell * this.coeficient),
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
