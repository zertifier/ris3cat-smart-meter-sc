import {Component, Input} from '@angular/core';
import {NgbTooltip, Placement} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-question-badge',
  standalone: true,
  imports: [
    NgbTooltip
  ],
  templateUrl: './question-badge.component.html',
  styleUrl: './question-badge.component.scss'
})
export class QuestionBadgeComponent {
  @Input({required: true}) text = '';
  @Input() tooltipPlacement: Placement = 'auto';
}
