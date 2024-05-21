import {Component} from '@angular/core';
import {Proposal, ProposalsService} from "../../services/proposals.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ProposalStatus} from "../../../domain/ProposalStatus";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UserStoreService} from "../../../../user/infrastructure/services/user-store.service";
import {htmlToText} from "html-to-text";

type ProposalType = 'active' | 'pending' | 'expired' | 'executed' | 'denied' | 'all';

@Component({
  selector: 'app-proposals-page',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgClass,
    NgIf,
    RouterLinkActive,
    RouterLink,
    FormsModule
  ],
  templateUrl: './proposals-page.component.html',
  styleUrl: './proposals-page.component.scss'
})
export class ProposalsPageComponent {

  proposals: Proposal[] = []
  proposalType: ProposalType = 'all'
  communityId!: number
  userRole: string | undefined = ''
  filterText!: string

  constructor(
    private proposalsService: ProposalsService,
    private userStore: UserStoreService
  ) {

    this.userStore.selectOnly(this.userStore.$.communityId).subscribe((community) => {
      this.communityId = community
      this.getAllProposals()
    })


    this.userStore
      .selectOnly(state => state).subscribe((data) => {
      if (data.user) {
        this.userRole = data.user?.role;
      }
    })


  }

  getAllProposals() {
    if (this.filterText) {
      this.proposalsService.getProposalsByFilterAndCommunity(this.communityId, this.filterText).subscribe((response) => {
        this.proposals = response.data.length ? response.data : []
        this.proposalType = 'all'
      })
    } else {
      this.proposalsService.getProposalsByCommunity(this.communityId).subscribe((response) => {
        this.proposals = response.data.length ? response.data : []
        this.proposalType = 'all'
      })
    }
  }

  getProposalsByStatus(status: ProposalStatus) {
    if (this.filterText) {
      this.proposalsService.getProposalsByFilterStatusCommunity(this.communityId, this.filterText || '', status).subscribe((response) => {
        this.proposals = response.data.length ? response.data : []
        this.proposalType = status
      })
    } else {
      this.proposalsService.getProposalsByStatusAndCommunity(this.communityId, status).subscribe((response) => {
        this.proposals = response.data.length ? response.data : []
        this.proposalType = status
      })
    }
  }

  getDescriptionText(htmlText: string) {
    return htmlToText(htmlText, {wordwrap: 150, baseElements: {selectors: ['p']}})
  }

  statusTranslation(status: ProposalStatus) {
    return this.proposalsService.statusTranslation(status)
  }

}
