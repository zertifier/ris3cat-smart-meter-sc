import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  QuestionBadgeComponent
} from "../../../../../../shared/infrastructure/components/question-badge/question-badge.component";
import {NoRoundDecimalPipe} from "../../../../../../shared/infrastructure/pipes/no-round-decimal.pipe";

@Component({
  selector: 'app-transfer-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    QuestionBadgeComponent,
    NoRoundDecimalPipe
  ],
  templateUrl: './transfer-modal.component.html',
  styleUrl: './transfer-modal.component.scss'
})
export class TransferModalComponent {

  @Input() type: 'EKW' | 'XDAI' | 'DAO' = 'XDAI';
  @Input() currentAmount: number = 0

  toDirection?: string
  amountToTransfer?: number

  constructor(
    public activeModal: NgbActiveModal
  ) {
  }


}
