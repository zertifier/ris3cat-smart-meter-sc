import {AfterViewInit, Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgIf} from "@angular/common";
import {UserCups} from "../../../../../../user/infrastructure/services/user-store.service";
import {FormsModule} from "@angular/forms";
import {
  ZertipowerCupsService
} from "../../../../../../../shared/infrastructure/services/zertipower/cups/ZertipowerCupsService";
import {ZertipowerService} from "../../../../../../../shared/infrastructure/services/zertipower/zertipower.service";

@Component({
  selector: 'app-cups-modal',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './cups-modal.component.html',
  styleUrl: './cups-modal.component.scss'
})
export class CupsModalComponent implements AfterViewInit{

  @Input() cups?: UserCups | undefined
  reference: string = ''
  loading: boolean = false

  constructor(
    public readonly activeModal: NgbActiveModal,
    private zertipower: ZertipowerService,
  ) {
  }

  ngAfterViewInit(): void {
    this.reference = this.cups?.reference || ''
  }


  async save(){
    this.loading = true
    if (this.cups){
      const response = await this.zertipower.cups.updateCupsReference(this.cups.id, this.reference)

      console.log(response)
      this.loading = false
    }
  }

}
