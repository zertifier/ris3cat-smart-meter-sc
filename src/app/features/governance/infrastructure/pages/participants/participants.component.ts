import { Component } from '@angular/core';
import {PaginatorModule} from "primeng/paginator";
import {ProposalStatus} from "../../../domain/ProposalStatus";
import {Subscription} from "rxjs";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Participant, ParticipantsService, ParticipantStatus} from "../../services/participants.service";
import {UserStoreService} from "../../../../user/infrastructure/services/user-store.service";

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

  participants: Participant[] = [
  ]
  constructor(
    private participantsService: ParticipantsService,
    private userStore: UserStoreService,
  ) {

    this.subscriptions.push(
      this.userStore.selectOnly(this.userStore.$.communityId).subscribe((community) => {
        this.communityId = community
        console.log(community)
        this.getParticipantsByStatus('active')
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
            console.log(this.participants.length)
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
            console.log(this.participants.length)
            this.loading = false
          }
        })
      )
    }
  }

}
