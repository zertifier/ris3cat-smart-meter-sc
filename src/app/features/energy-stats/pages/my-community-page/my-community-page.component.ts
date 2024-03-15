import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {NavbarComponent} from "../../../../shared/components/navbar/navbar.component";
import {ChartModule} from "primeng/chart";
import {MonitoringService, PowerStats} from "../../services/monitoring.service";
import {Subscription} from "rxjs";
import {JsonPipe} from "@angular/common";

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
  readonly currentProduction = signal<PowerStats>({production: 0, grid: 0, consumption: 0})

  readonly solarPanels = 10;
  readonly kwhMonth460wp = [20, 25, 35, 45, 55, 65, 75, 75, 60, 45, 35, 25]

  subscriptions: Subscription[] = [];

  constructor(private readonly monitoringService: MonitoringService) {
    this.monitoringService.start(5000);
  }

  ngOnInit(): void {
    let subscription = this.monitoringService
      .getPowerFlow()
      .subscribe(value => this.currentProduction.set(value))

    this.subscriptions.push(subscription);


    const textColor = 'rgba(0, 0, 0, 0.87)';
    const textColorSecondary = 'rgba(0, 0, 0, 0.54)';
    const surfaceBorder = 'rgba(0, 0, 0, 0.12)';

    this.data = {
      labels: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
      datasets: [
        {
          label: 'Contadors',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          data: this.kwhMonth460wp.map((item) => item * this.solarPanels)
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
}
