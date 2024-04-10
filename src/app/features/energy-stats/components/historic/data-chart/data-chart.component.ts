import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChartModule} from "primeng/chart";
import {ChartStoreService} from "../../../services/chart-store.service";
import {ChartResource} from "../../../domain/ChartResource";
import {Subscription} from "rxjs";

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
  options: any;
  subscriptions: Subscription[] = [];

  constructor(private chartStoreService: ChartStoreService) {
  }

  ngOnInit(): void {
    const textColor = 'rgba(0, 0, 0, 0.87)';
    const textColorSecondary = 'rgba(0, 0, 0, 0.54)';
    const surfaceBorder = 'rgba(0, 0, 0, 0.12)';

    this.chartStoreService.selectOnly(this.chartStoreService.$.justData).subscribe((state) => {
      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            display: false,
            // labels: {
            //   color: textColor
            // }
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
                const label = state.selectedChartResource === ChartResource.ENERGY ? 'kWh' : '€'
                return `${value} ${label}`;
              },
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      }
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
