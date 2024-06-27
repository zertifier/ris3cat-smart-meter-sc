import {Component, inject, OnInit} from '@angular/core';
import {EnergyPredictionChartComponent} from "./metereologic-chart/energy-prediction-chart.component";
import {ChartDataset} from "@shared/infrastructure/interfaces/ChartDataset";
import {StatsColors} from "../../../domain/StatsColors";
import {WeatherPredictionService} from "../../services/weather-prediction.service";
import {EnergyPredictionService} from "../../services/energy-prediction.service";
import dayjs from 'dayjs';

@Component({
  selector: 'app-metereologic-prediction',
  standalone: true,
  imports: [
    EnergyPredictionChartComponent
  ],
  templateUrl: './metereologic-prediction.component.html',
  styleUrl: './metereologic-prediction.component.scss'
})
export class MetereologicPredictionComponent implements OnInit {
  weatherPredictionService = inject(WeatherPredictionService)
  elements: {
    label: string
    image: string
  }[] = [];

  async ngOnInit() {
    const prediction = await this.weatherPredictionService.getPrediction();

    for (const [day, weather] of prediction) {
      this.elements.push({
        label: day,
        image: `/assets/img/weather/${weather.icon}.png`
      });
    }
  }
}
