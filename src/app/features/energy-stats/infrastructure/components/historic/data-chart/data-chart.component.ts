import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {ChartModule} from "primeng/chart";
import {Subscription} from "rxjs";
import {ChartStoreService} from "../../../services/chart-store.service";
import {ChartResource} from "../../../../domain/ChartResource";

@Component({
  selector: 'app-data-chart',
  standalone: true,
  imports: [
    ChartModule
  ],
  templateUrl: './data-chart.component.html',
  styleUrl: './data-chart.component.scss'
})
export class DataChartComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() options: any;
  subscriptions: Subscription[] = [];

  textColor = 'rgba(0, 0, 0, 0.87)';
  textColorSecondary = 'rgba(0, 0, 0, 0.54)';
  surfaceBorder = 'rgba(0, 0, 0, 0.12)';

  constructor(private chartStoreService: ChartStoreService) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth <= 990)
      this.changeToMobile();
    else
      this.changeToDesktop()
  }

  ngOnInit(): void {
    this.chartStoreService.selectOnly(this.chartStoreService.$.justData).subscribe(() => {
      if (window.innerWidth <= 990) {
        this.changeToMobile();
      } else {
        this.changeToDesktop();
      }
    });
  }


  changeToDesktop() {
    const state = this.chartStoreService.snapshot();
    this.options = {
      ...this.options,
      maintainAspectRatio: false,
      indexAxis: 'x',
      aspectRatio: 0.8,
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: this.textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            callback: function (value: any, index: any, values: any) {
              const label = state.selectedChartResource === ChartResource.ENERGY ? 'kWh' : '€'
              return `${value} ${label}`;
            },
            color: this.textColorSecondary
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        }
      }
    }
  }

  changeToMobile() {
    const state = this.chartStoreService.snapshot();
    this.options = {
      ...this.options,
      maintainAspectRatio: false,
      aspectRatio: 0.1,
      indexAxis: 'y',
      scales: {
        y: {
          stacked: true,
          ticks: {
            color: this.textColorSecondary,
            font: {
              weight: 500
            },

          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          stacked: true,
          ticks: {
            callback: function (value: any, index: any, values: any) {
              const label = state.selectedChartResource === ChartResource.ENERGY ? 'kWh' : '€'
              return `${value} ${label}`;
            },
            color: this.textColorSecondary
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        }
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
