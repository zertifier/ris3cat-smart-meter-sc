import { Component } from '@angular/core';
import {ProposalsService, SaveProposal} from "../../../services/proposals.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-proposal-page',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './new-proposal-page.component.html',
  styleUrl: './new-proposal-page.component.scss'
})
export class NewProposalPageComponent {

  proposal!: string;
  proposalDescription!: string;
  loading: boolean = false

  constructor(
    private proposalsService: ProposalsService,
    private router: Router
  ) {
  }

  saveProposal(){
    this.loading = true;
    const proposal: SaveProposal = {
      userId: 29,
      communityId: 1,
      expirationDt: '2024-03-29 00:00:00',
      status: 'active',
      proposal: this.proposal,
      description: this.proposalDescription,
      quorum: 0,
      transparent: 0,
      type: ''
    }
    this.proposalsService.saveProposal(proposal).subscribe(
      (savedProposal) => {
        Swal.fire({
          icon: 'success',
          title: 'Proposta guardada correctament',
          confirmButtonText: 'Entès',
          customClass: {
            confirmButton: 'btn btn-secondary-force'
          }
        }).then( ()=> {
          console.log(savedProposal)
          this.loading = false
          this.router.navigate(['/governance/proposals']);
        });
    },
      (error) => {

        Swal.fire({
          icon: 'error',
          title: 'ERROR',
          text: 'Hi ha hagut un error creant la proposta, revisa que tots els camps estiguin complets',
          confirmButtonText: 'Entès',
          customClass: {
            confirmButton: 'btn btn-secondary-force'
          }
        }).then( ()=> {
          this.loading = false
          console.log("ERRROR", error)
        });

      })
  }

}
