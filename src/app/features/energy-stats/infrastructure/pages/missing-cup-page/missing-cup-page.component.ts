import {Component} from '@angular/core';
import {
  QuestionBadgeComponent
} from "../../../../../shared/infrastructure/components/question-badge/question-badge.component";

@Component({
  selector: 'app-missing-cup-page',
  standalone: true,
  imports: [
    QuestionBadgeComponent
  ],
  templateUrl: './missing-cup-page.component.html',
  styleUrl: './missing-cup-page.component.scss'
})
export class MissingCupPageComponent {

}
