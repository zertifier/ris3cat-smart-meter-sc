import {Component} from '@angular/core';
import {
  QuestionBadgeComponent
} from "../../../../../shared/infrastructure/components/question-badge/question-badge.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-cups-register-form',
  standalone: true,
  imports: [
    QuestionBadgeComponent
  ],
  templateUrl: './cups-register-form.component.html',
  styleUrl: './cups-register-form.component.scss'
})
export class CupsRegisterFormComponent {

  constructor(private activeModal: NgbActiveModal) {
  }

  closeModal() {
    this.activeModal.close('cross click');
  }
}
