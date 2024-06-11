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
  chart!: Chart<"bar", unknown[], string>;

  @Input() dataset: ChartDataset[] = [];
  @Input() labels: string[] = ['Dillluns', "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte", "Diumenge"];


  ngAfterViewInit(): void {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: this.dataset.map(d => {
          return {
            data: d.data,
            label: d.label,
            backgroundColor: d.color,
            order: d.order,
            stack: d.stack,
            borderRadius: 10,
            borderWidth: 1,
          }
        })
      },
      options: {
        aspectRatio: 4,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    });
  }
}
