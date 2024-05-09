import {Component} from '@angular/core';
import {
  QuestionBadgeComponent
} from "../../../../../shared/infrastructure/components/question-badge/question-badge.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CupsRegisterFormComponent} from "../../components/cups-register-form/cups-register-form.component";
import {DatadisRegisterFormComponent} from "../../components/datadis-register-form/datadis-register-form.component";

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
  constructor(private readonly ngbModal: NgbModal) {
  }
  public registerCups() {
    this.ngbModal.open(DatadisRegisterFormComponent);
  }
}
