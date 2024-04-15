import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../../../../shared/components/navbar/navbar.component";
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {EnergyPrice, SharingUsersService} from "../../services/sharing-users.service";
import {MonitoringService} from "../../services/monitoring.service";
import {AddUserFormModalComponent} from "../../components/add-user-form-modal/add-user-form-modal.component";



@Component({
  selector: 'app-share-page',
  standalone: true,
  imports: [
    NgbModule,
    NavbarComponent,
  ],
  providers: [
    MonitoringService,
  ],
  templateUrl: './share-page.component.html',
  styleUrl: './share-page.component.scss'
})
export class SharePageComponent implements OnInit {

  constructor(
    private ngModal: NgbModal,
    protected sharingUsers: SharingUsersService,
    private monitoringService: MonitoringService
  ) {
  }

  ngOnInit(): void {
  }


  addUser() {
    this.ngModal.open(AddUserFormModalComponent);
  }

  removeUser(id: string) {
    this.sharingUsers.removeUser(id);
  }

  protected readonly EnergyPrice = EnergyPrice;
}
