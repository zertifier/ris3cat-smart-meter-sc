import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {NavbarComponent} from "../../../../shared/components/navbar/navbar.component";
import {ChartModule} from "primeng/chart";
import {EnergyStat, MonitoringService, PowerStats} from "../../services/monitoring.service";
import {Subscription} from "rxjs";
import {JsonPipe} from "@angular/common";
import dayjs from "dayjs";
import {producerAccessed} from "@angular/core/primitives/signals";

@Component({
  selector: 'app-my-community-page',
  standalone: true,
  imports: [
    NavbarComponent,
    ChartModule,
    JsonPipe
  ],
  templateUrl: './my-community-page.component.html',
  styleUrl: './my-community-page.component.scss'
})
export class MyCommunityPageComponent implements OnInit, OnDestroy {
  data: any
  options: any
  readonly powerFlow = signal<PowerStats>({production: 0, grid: 0, consumption: 0})

  readonly solarPanels = 10;
  readonly kwhMonth460wp = [20, 25, 35, 45, 55, 65, 75, 75, 60, 45, 35, 25]

  subscriptions: Subscription[] = [];

  constructor(private readonly monitoringService: MonitoringService) {
    this.monitoringService.start(5000);
  }

  async ngOnInit(): Promise<void> {
    let subscription = this.monitoringService
      .getPowerFlow()
      .subscribe(value => {
        const {production, grid, consumption} = value;
        this.powerFlow.set({
          production: Math.round(production / 10) / 100,
          consumption: Math.round(consumption / 10) / 100,
          grid: Math.round(grid / 10) / 100
        })
      })

    this.subscriptions.push(subscription);


    const textColor = 'rgba(0, 0, 0, 0.87)';
    const textColorSecondary = 'rgba(0, 0, 0, 0.54)';
    const surfaceBorder = 'rgba(0, 0, 0, 0.12)';

    const data: EnergyStat[] = await this.monitoringService.getEnergyStats('2023-12-01', 3);

    this.data = {
      labels: data.map(d => dayjs(d.date).format("YYYY-MM")),
      // labels: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
      datasets: [
        {
          label: 'Produccio',
          // backgroundColor: 'rgba(54, 162, 235, 0.2)',
          // borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          data: data.map(d => d.sell + d.inHouseConsumption),
          stack: 'Stack 0'
        },
        {
          label: 'Consum de la xarxa electrica',
          borderWidth: 1,
          data: data.map(d => d.buy),
          stack: 'Stack 1'
        },
        {
          label: 'Consum propi',
          // backgroundColor: 'rgba(54,235,93,0.2)',
          // borderColor: 'rgb(54,235,57)',
          borderWidth: 1,
          data: data.map(d => d.inHouseConsumption),
          stack: 'Stack 1'
        },
        {
          label: 'Venta energetica',
          borderWidth: 1,
          data: data.map(d => d.sell),
          stack: 'Stack 2'
        }
      ]
    }

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            callback: function (value: any, index: any, values: any) {
              return value + ' kWh'
            },
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    })
  }

  protected readonly producerAccessed = producerAccessed;
}
