import {Component, Input} from '@angular/core';
import {StatsColors} from "../../../models/StatsColors";
import {NgStyle} from "@angular/common";

export interface DataLabel {
  label: string;
  color: string;
  radius: string;
}

@Component({
  selector: 'app-chart-legend',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './chart-legend.component.html',
  styleUrl: './chart-legend.component.scss'
})
export class ChartLegendComponent {

  @Input() labels: DataLabel[] = [];
}
