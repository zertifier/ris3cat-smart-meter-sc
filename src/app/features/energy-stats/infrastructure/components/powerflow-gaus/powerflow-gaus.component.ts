import {Component, computed, Input, OnChanges, Signal, signal, SimpleChanges} from '@angular/core';
import {StatsColors} from "../../../domain/StatsColors";
import {KnobModule} from "primeng/knob";
import {NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {
  BreakPoints,
  ScreenBreakPointsService
} from "../../../../../shared/infrastructure/services/screen-break-points.service";

@Component({
  selector: 'app-powerflow-gaus',
  standalone: true,
  imports: [
    KnobModule,
    NgStyle,
    FormsModule
  ],
  templateUrl: './powerflow-gaus.component.html',
  styleUrl: './powerflow-gaus.component.scss'
})
export class PowerflowGausComponent implements OnChanges {
  @Input({required: true}) production: number = 0;
  @Input({required: true}) sell: number = 0;

  protected hasEnoughSpace = signal(this.breakpointsService.getCurrentBreakPoint() >= BreakPoints.MD);
  protected powerFlow = signal({sell: this.sell, production: this.production});
  readonly knobValue: Signal<string> = computed(() => {
    const consumptionRatio = (this.powerFlow().sell * 100) / this.powerFlow().production;
    if (isNaN(consumptionRatio)) {
      return '0 %';
    }

    return `${consumptionRatio.toFixed(0)} %`;
  })
  protected knobSize = signal(0);
  protected readonly StatsColors = StatsColors;

  constructor(private breakpointsService: ScreenBreakPointsService) {
    this.breakpointsService.observeBreakpoints().subscribe((currentBreakpoint) => {
      const hasEnoughSpace = currentBreakpoint >= BreakPoints.MD
      this.hasEnoughSpace.set(hasEnoughSpace);

      if (!hasEnoughSpace) {
        this.knobSize.set(window.innerWidth * 0.5);
      } else {
        this.knobSize.set(window.innerWidth * 0.3);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    const production: number = (changes as any).production.currentValue;
    const sell: number = (changes as any).sell.currentValue;
    this.powerFlow.set({production, sell});
  }
}
