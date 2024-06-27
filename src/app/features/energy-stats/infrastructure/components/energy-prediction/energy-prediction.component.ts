import {Component, inject, OnInit} from '@angular/core';
import {EnergyPredictionChartComponent} from "../metereologic-prediction/metereologic-chart/energy-prediction-chart.component";
import {ChartDataset} from "@shared/infrastructure/interfaces/ChartDataset";
import {StatsColors} from "../../../domain/StatsColors";
import {EnergyPredictionService} from "../../services/energy-prediction.service";
import dayjs from "dayjs";
import 'dayjs/locale/ca';

@Component({
  selector: 'app-energy-prediction',
  standalone: true,
  imports: [
    EnergyPredictionChartComponent
  ],
  templateUrl: './energy-prediction.component.html',
  styleUrl: './energy-prediction.component.scss'
})
export class EnergyPredictionComponent implements OnInit {
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
    dayjs.locale('ca');
    const productionPrediction = await this.energyPredictionService.getPrediction();
    const dailyPrediction: Map<string, number> = new Map();
    for (const predictionEntry of productionPrediction) {
      // const parsedDate = dayjs(predictionEntry.time).format("YYYY-MM-DD");
      const parsedDate = dayjs(predictionEntry.time).format("dddd DD");

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
