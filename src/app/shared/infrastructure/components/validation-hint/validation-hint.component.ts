import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-validation-hint',
  standalone: true,
  imports: [],
  templateUrl: './validation-hint.component.html',
  styleUrl: './validation-hint.component.scss'
})
export class ValidationHintComponent implements OnChanges {
  @Input({required: true}) condition!: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    const newValue = (changes as any).condition.currentValue;
    this.condition = newValue
  }
}
