import {Component} from '@angular/core';
import {PaginatorModule} from "primeng/paginator";
import {ProposalStatus} from "../../../domain/ProposalStatus";
import {Subscription} from "rxjs";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Participant, ParticipantsService, ParticipantStatus} from "../../services/participants.service";
import {UserStoreService} from "../../../../user/infrastructure/services/user-store.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    PaginatorModule,
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss'
})
export class ParticipantsComponent {

  filterText!: string
  subscriptions: Subscription[] = [];
  participantStatus: ParticipantStatus = "active";
  communityId?: number;
  loading: boolean = true

  participants: Participant[] = []

  constructor(
    private participantsService: ParticipantsService,
    private userStore: UserStoreService,
  ) {

    this.subscriptions.push(
      this.userStore.selectOnly(this.userStore.$.communityId).subscribe((community) => {
        this.communityId = community
        console.log(community)
        this.getParticipantsByStatus(this.participantStatus)
      })
    )
  }


  getParticipantsByStatus(status: ParticipantStatus) {
    this.participantStatus = status
    if (this.filterText) {
      this.subscriptions.push(
        this.participantsService.getParticipantsFilter(this.communityId!, status, this.filterText || '').subscribe({
          next: response => {
            this.participants = response.data
            this.loading = false
          },
          error: err => {
            this.participants = []
            this.loading = false
          }
        })
      )
    } else {
      this.subscriptions.push(
        this.participantsService.getParticipants(this.communityId!, status).subscribe({
          next: response => {
            this.participants = response.data
            this.loading = false
          },
          error: err => {
            this.participants = []
            this.loading = false
          }
        })
      )
    }
  }

  activateParticipant(id: number) {
    this.subscriptions.push(
      this.participantsService.activateParticipant(id).subscribe({
        next: resutl => {

          Swal.fire({
            icon: "success",
            title: "El participant s'ha activat correctament",
            confirmButtonText: 'Entès',
            customClass: {
              confirmButton: 'btn btn-secondary-force'
            }
          }).then(() => {
            this.getParticipantsByStatus(this.participantStatus)
          })
        },
        error: err => {
          this.swalErrorDisplay('Hi ha hagut un error amb la proposta. Espera uns minuts i torna-ho a intentar.').then(() => {
            console.log("ERRROR", err)
          })
        }
      })
    )
  }


  swalErrorDisplay(message: string) {
    return Swal.fire({
      icon: 'error',
      title: 'ERROR',
      text: message,
      confirmButtonText: 'Entès',
      customClass: {
        confirmButton: 'btn btn-secondary-force'
      }
    })
  }
}
