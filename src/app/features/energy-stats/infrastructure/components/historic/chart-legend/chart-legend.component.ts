import {Component, Input} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";

export interface DataLabel {
  label: string;
  color: string;
  radius: string;
  toggle: () => boolean;
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
  toggleLabel(index: number) {
    const label = this.labels[index];
    label.hidden = label.toggle();
  }
}
