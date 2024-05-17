import {Component} from '@angular/core';
import {
  QuestionBadgeComponent
} from "../../../../../shared/infrastructure/components/question-badge/question-badge.component";

@Component({
  selector: 'app-governance-page',
  standalone: true,
  imports: [
    QuestionBadgeComponent
  ],
  templateUrl: './governance-page.component.html',
  styleUrl: './governance-page.component.scss'
})
export class GovernancePageComponent {

}
