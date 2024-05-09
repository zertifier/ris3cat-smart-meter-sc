import { Component } from '@angular/core';
import {
    QuestionBadgeComponent
} from "../../../../../shared/infrastructure/components/question-badge/question-badge.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-datadis-register-form',
  standalone: true,
    imports: [
        QuestionBadgeComponent
    ],
  templateUrl: './datadis-register-form.component.html',
  styleUrl: './datadis-register-form.component.scss'
})
export class DatadisRegisterFormComponent {
  constructor(private ngbActiveModal: NgbActiveModal) {
  }

  public closeModal() {
    this.ngbActiveModal.close('cross click');
  }
}
