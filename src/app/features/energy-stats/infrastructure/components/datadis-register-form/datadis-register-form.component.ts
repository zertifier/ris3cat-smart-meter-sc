import { Component } from '@angular/core';
import {
    QuestionBadgeComponent
} from "../../../../../shared/infrastructure/components/question-badge/question-badge.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe} from "@angular/common";
import Swal from "sweetalert2";

@Component({
  selector: 'app-datadis-register-form',
  standalone: true,
  imports: [
    QuestionBadgeComponent,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './datadis-register-form.component.html',
  styleUrl: './datadis-register-form.component.scss'
})
export class DatadisRegisterFormComponent {

  protected formData = this.formBuilder.group({
    dni: new FormControl<string>('', [Validators.required]),
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
    cups: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) {
  }

  public closeModal() {
    this.ngbActiveModal.close('cross click');
  }

  public registerCups() {
    if (this.formData.invalid) {
      Swal.fire({
        title: 'Formulari no valid',
        icon: "error",
      });
      return;
    }
  }
}
