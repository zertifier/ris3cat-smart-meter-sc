import {Component, inject, OnInit} from '@angular/core';
import {MetereologicChartComponent} from "./metereologic-chart/metereologic-chart.component";
import {ChartDataset} from "@shared/infrastructure/interfaces/ChartDataset";
import {StatsColors} from "../../../domain/StatsColors";
import {WeatherPredictionService} from "../../services/weather-prediction.service";
import {EnergyPredictionService} from "../../services/energy-prediction.service";
import dayjs from 'dayjs';

@Component({
  selector: 'app-metereologic-prediction',
  standalone: true,
  imports: [
    MetereologicChartComponent
  ],
  templateUrl: './metereologic-prediction.component.html',
  styleUrl: './metereologic-prediction.component.scss'
})
export class MetereologicPredictionComponent implements OnInit {
  weatherPredictionService = inject(WeatherPredictionService)
  datasets: ChartDataset[] = [
    {
      color: StatsColors.COMMUNITY_PRODUCTION,
      label: 'Producció',
      data: [1, 2, 3, 4, 5, 6],
    }
  ];
  elements: {
    label: string
    image: string
  }[] = [];
  labels: string [] = [];
  energyPredictionService = inject(EnergyPredictionService);

  async ngOnInit() {
    const prediction = await this.weatherPredictionService.getPrediction();

    for (const [day, weather] of prediction) {
      this.elements.push({
        label: day,
        image: `/assets/img/weather/${weather.icon}.png`
      });
      this.labels = [...this.labels, ''];
    }

    const productionPrediction = await this.energyPredictionService.getPrediction();
    const dailyPrediction: Map<string, number> = new Map();
    for (const predictionEntry of productionPrediction) {
      const parsedDate = dayjs(predictionEntry.time).format("YYYY-MM-DD 00:00");
      const value = dailyPrediction.get(parsedDate) || 0;
      dailyPrediction.set(parsedDate, value + predictionEntry.value);
    }

    this.datasets = [
      {
        color: StatsColors.COMMUNITY_PRODUCTION,
        label: 'Producció',
        data: Array.from(dailyPrediction.values()),
      }
    ];
    this.labels = Array.from(dailyPrediction.keys());
  }
}
