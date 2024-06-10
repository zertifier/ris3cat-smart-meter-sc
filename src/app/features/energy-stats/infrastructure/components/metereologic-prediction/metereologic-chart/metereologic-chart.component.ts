import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Chart} from "chart.js";
import {ChartDataset} from "@shared/infrastructure/interfaces/ChartDataset";

@Component({
  selector: 'app-metereologic-chart',
  standalone: true,
  imports: [],
  templateUrl: './metereologic-chart.component.html',
  styleUrl: './metereologic-chart.component.scss'
})
export class MetereologicChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas') canvas!: ElementRef;
  chart!: Chart;

  @Input() dataset: ChartDataset[] = [];


  ngAfterViewInit(): void {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['', '', '', '', '', '', ''],
        datasets: [
          {
            label: 'Consum',
            data: [12, 19, 3, 5, 2, 3, 6],
            borderWidth: 1
          },
          {
            label: 'Producció',
            data: [3, 5, 2, 3, 6, 12, 19].map(d => d * Math.random() + 1),
            borderWidth: 1
          }
        ]
      },
      options: {
        aspectRatio: 4,
        scales: {
          y: {
            beginAtZero: true
          }
        },
      }
    });
  }


}
