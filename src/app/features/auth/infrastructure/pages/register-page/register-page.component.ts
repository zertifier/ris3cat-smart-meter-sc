import {Component} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe} from "@angular/common";
import Swal from "sweetalert2";
import {Router, RouterState} from "@angular/router";
import {AuthStoreService} from "../../services/auth-store.service";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  formData = this.formBuilder.group({
    dni: new FormControl<string>(''),
    name: new FormControl<string>('', [Validators.required]),
    lastname: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authStore: AuthStoreService
  ) {
  }

  register() {
    if (this.formData.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulari no valid'
      });
      return;
    }
  }

  goBack() {
    this.authStore.patchState({loginTry: false});
    this.router.navigate(['/auth/login']);
  }
}
