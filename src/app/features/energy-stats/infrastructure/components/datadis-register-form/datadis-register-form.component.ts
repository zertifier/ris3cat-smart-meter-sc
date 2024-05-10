import {Component, EventEmitter} from '@angular/core';
import {
    QuestionBadgeComponent
} from "../../../../../shared/infrastructure/components/question-badge/question-badge.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe} from "@angular/common";
import Swal from "sweetalert2";
import {ZertipowerService} from "../../../../../shared/infrastructure/services/zertipower/zertipower.service";
import {UserStoreService} from "../../../../user/infrastructure/services/user-store.service";
import {EventBus} from "../../../../../shared/domain/EventBus";
import {UserProfileChangedEvent} from "../../../../auth/domain/UserProfileChangedEvent";

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
    private zertipower: ZertipowerService,
    private userStore: UserStoreService,
    private eventBus: EventBus
  ) {
  }

  public closeModal() {
    this.ngbActiveModal.close('cross click');
  }

  public async registerCups() {
    if (this.formData.invalid) {
      Swal.fire({
        title: 'Formulari no valid',
        icon: "error",
      });
      return;
    }

    const {dni, password, cups, username} = this.formData.value;
    const customerId = this.userStore.snapshotOnly(state => state.user!.customer_id);
    try {
      await this.zertipower.cups.registerDatadis(customerId!, cups!, dni!, username!, password!);
    } catch (err) {
      Swal.fire({
        title: 'Hi ha hagut un error',
        icon: "error",
      });
      return;
    }

    await this.eventBus.publishEvents(new UserProfileChangedEvent());
    this.ngbActiveModal.close('finished');
  }
}
