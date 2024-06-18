import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-cups-modal',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './cups-modal.component.html',
  styleUrl: './cups-modal.component.scss'
})
export class CupsModalComponent {

  @Input() cups?: string | undefined

  constructor(
    public readonly activeModal: NgbActiveModal
  ) {
  }

}
