import {Component, Input} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";

export interface DataLabel {
  label: string;
  color: string;
  radius: string;
  toggle: (label: DataLabel) => DataLabel;
  hidden: boolean;
}

@Component({
  selector: 'app-chart-legend',
  standalone: true,
  imports: [
    NgStyle,
    NgClass
  ],
  templateUrl: './chart-legend.component.html',
  styleUrl: './chart-legend.component.scss'
})
export class ChartLegendComponent {
  @Input() labels: DataLabel[] = [];
  @Input() containerClassList: string = 'd-flex justify-content-around flex-wrap';
  toggleLabel(index: number) {
    const label = this.labels[index];
    this.labels[index] = label.toggle({...label});
  }
}
