import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ChartModule} from "primeng/chart";
import {Subscription} from "rxjs";
import {ChartStoreService} from "../../../services/chart-store.service";
import {ChartResource} from "../../../../domain/ChartResource";
import {ChartLegendComponent} from "../chart-legend/chart-legend.component";
import {Chart} from "chart.js";
import {ChartEntity} from "../../../../domain/ChartEntity";
import {AsyncPipe, NgIf} from "@angular/common";

import zoomPlugin, {resetZoom} from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

export interface ChartDataset {
  label: string,
  color: string,
  order?: number,
  stack?: string,
  data: unknown[],
}

@Component({
  selector: 'app-data-chart',
  standalone: true,
  imports: [
    ChartModule,
    ChartLegendComponent,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './data-chart.component.html',
  styleUrl: './data-chart.component.scss'
})
export class DataChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  data!: {
    datasets: any[],
    labels: string[]
  };
  @Input({required: true}) dataset: ChartDataset[] = [];
  @Input({required: true}) labels: string[] = [];
  private chart!: Chart;
  @ViewChild('chart') chartElement!: ElementRef;
  // legendLabels: DataLabel[] = [];

  private subscriptions: Subscription[] = [];

  private textColorSecondary = 'rgba(0, 0, 0, 0.54)';
  private surfaceBorder = 'rgba(0, 0, 0, 0.12)';

  private options: any = {
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
        }
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value: never) => {
            const state = this.chartStoreService.snapshot();
            const label = state.selectedChartResource === ChartResource.ENERGY ? 'kWh' : '€'
            return `${value} ${label}`;
          },
          color: this.textColorSecondary
        },
        grid: {
          color: this.surfaceBorder,
        }
      }
    },
    interaction: {
      intersect: true,
      mode: 'index',
    },
    plugins: {
      zoom: {
        zoom: {
          enabled: false,
          // wheel: {
          //   enabled: false,
          // },
          // pinch: {
          //   enabled: true,
          // },
          // mode: 'xy',
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const {label} = context.dataset;
            let {formattedValue} = context;
            const chartEntity = this.chartStoreService.snapshotOnly(state => state);

            if (context.datasetIndex === 1 && chartEntity.selectedChartEntity === ChartEntity.COMMUNITIES) {
              const value = context.raw;
              const register = this.chartStoreService.snapshot().lastFetchedStats[context.dataIndex];
              const total = register.productionActives + value;
              formattedValue = total.toLocaleString();
            }

            const unit = chartEntity.selectedChartResource === ChartResource.ENERGY ? 'kWh' : '€'
            const labels: string[] = [`${label}: ${formattedValue} ${unit}`];

            if (chartEntity.selectedChartEntity === ChartEntity.COMMUNITIES) {
              const stat = this.chartStoreService.snapshot().lastFetchedStats[context.dataIndex];
              if (context.datasetIndex === 1) {
                // Todo: change 31 to the real number
                labels.push(`Total membres: 31`);
                // labels.push(`----------------`);
              } else if (context.datasetIndex === 3) {
                labels.push(`Membres actius: ${stat.activeMembers}`);
                labels.push(`----------------`);
              }
            }
            return labels;
          }
        }
      }
    }
  };

  constructor(
    private chartStoreService: ChartStoreService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataset = (changes as any).dataset.currentValue;
    this.labels = (changes as any).labels.currentValue;

    this.parseInput();
    this.refreshChart();
  }

  ngAfterViewInit(): void {
    this.chart = new Chart(this.chartElement.nativeElement, {
      type: 'bar',
      data: this.data,
      options: this.options,
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 990) {
      this.changeToMobile();
    } else {
      this.changeToDesktop();
    }
  }

  public resetChartZoom() {
    if (!this.chart) {
      return;
    }
    resetZoom(this.chart);
  }

  public toggleDataset(index: number) {
    if (!this.chart) {
      return;
    }
    const visible = this.getDatasetVisibility(index);
    this.setDatasetVisible(index, !visible);
  }

  public setDatasetVisible(index: number, visible: boolean) {
    if (!this.chart) {
      return;
    }
    this.chart.setDatasetVisibility(index, visible);
    this.chart.update();
  }

  public getDatasetVisibility(index: number): boolean {
    return this.chart.isDatasetVisible(index);
  }

  private changeToDesktop() {
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
          }
        },
        y: {
          stacked: true,
          ticks: {
            callback: function (value: never) {
              const label = state.selectedChartResource === ChartResource.ENERGY ? 'kWh' : '€'
              return `${value} ${label}`;
            },
            color: this.textColorSecondary
          },
          grid: {
            color: this.surfaceBorder,
          }
        }
      }
    }

    this.refreshChart();
  }

  private changeToMobile() {
    const state = this.chartStoreService.snapshot();
    this.options = {
      ...this.options,
      maintainAspectRatio: false,
      aspectRatio: 0.5,
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
            callback: function (value: never) {
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

    this.refreshChart();
  }

  public refreshChart() {
    if (!this.chart) {
      return;
    }

    this.chart.options = this.options;
    this.chart.data = this.data;
    this.chart.update();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private parseInput() {
    const datasets: any[] = [];
    for (const entry of this.dataset) {
      datasets.push({
        label: entry.label,
        backgroundColor: entry.color,
        borderRadius: 10,
        borderWidth: 1,
        data: entry.data,
        stack: entry.stack,
        grouped: true,
        order: entry.order,
      });
    }

    this.data = {
      labels: this.labels,
      datasets,
    }

    this.chartStoreService.selectOnly(this.chartStoreService.$.params).subscribe(() => {
      if (window.innerWidth <= 990) {
        this.changeToMobile();
      } else {
        this.changeToDesktop();
      }
    });
  }
}
