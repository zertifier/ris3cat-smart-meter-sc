import { Component } from '@angular/core';
import {Proposal, ProposalsService} from "../../services/proposals.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ProposalStatus} from "../../../domain/ProposalStatus";
import {RouterLink, RouterLinkActive} from "@angular/router";

type ProposalType = 'active' | 'pending' | 'finished' | 'executed' | 'succeeded' | 'defeated' | 'all';
@Component({
  selector: 'app-proposals-page',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgClass,
    NgIf,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './proposals-page.component.html',
  styleUrl: './proposals-page.component.scss'
})
export class ProposalsPageComponent {

  proposals: Proposal[] = []
  proposalType: ProposalType = 'all'
  constructor(
    private proposalsService: ProposalsService
  ) {

    this.getAllProposals()
  }


  getAllProposals(){
    this.proposalsService.getProposals().subscribe((response) => {
      this.proposals = response.data
      this.proposalType = 'all'
    })
  }

  getProposalsByStatus(status: ProposalStatus){
    this.proposalsService.getProposalsByStatus(status).subscribe((response) => {
      this.proposals = response.data
      this.proposalType = status
    })
  }

  statusTranslation(status: ProposalStatus){
    switch (status.toLowerCase()){
      case "active": return 'Actiu'
      case "pending": return 'Pendent'
      case "succeeded": return 'Acceptada'
      case "executed": return 'Executada'
      case "defeated": return 'Vençuda'
      default: return
    }
  }

}
