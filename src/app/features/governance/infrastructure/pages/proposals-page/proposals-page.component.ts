import { Component } from '@angular/core';
import {Proposal, ProposalsService} from "../../services/proposals.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ProposalStatus} from "../../../domain/ProposalStatus";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {FormsModule} from "@angular/forms";

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
    RouterLink,
    FormsModule
  ],
  templateUrl: './proposals-page.component.html',
  styleUrl: './proposals-page.component.scss'
})
export class ProposalsPageComponent {

  proposals: Proposal[] = []
  proposalType: ProposalType = 'all'
  filterText!: string

  constructor(
    private proposalsService: ProposalsService
  ) {

    this.getAllProposals()
  }

  getAllProposals(){
    if (this.filterText){
      this.proposalsService.getProposalsByFilter(this.filterText).subscribe((response) => {
        this.proposals = response.data.length ? response.data : []
        this.proposalType = 'all'
      })
    }else{
      this.proposalsService.getProposals().subscribe((response) => {
        this.proposals = response.data.length ? response.data : []
        this.proposalType = 'all'
      })
    }
  }

  getProposalsByStatus(status: ProposalStatus){
    if(this.filterText){
      this.proposalsService.getProposalsByFilterAndStatus(this.filterText || '', status).subscribe((response) => {
        this.proposals = response.data.length ? response.data : []
        this.proposalType = status
      })
    }else{
      this.proposalsService.getProposalsByStatus(status).subscribe((response) => {
        this.proposals = response.data.length ? response.data : []
        this.proposalType = status
      })
    }
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
