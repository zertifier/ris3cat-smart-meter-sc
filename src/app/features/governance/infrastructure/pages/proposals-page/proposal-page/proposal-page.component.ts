import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {Proposal, ProposalsService} from "../../../services/proposals.service";
import Swal from "sweetalert2";
import {CalendarModule} from "primeng/calendar";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {
  QuestionBadgeComponent
} from "../../../../../../shared/infrastructure/components/question-badge/question-badge.component";
import {ReactiveFormsModule} from "@angular/forms";
import {ProposalStatus} from "../../../../domain/ProposalStatus";
import {ProposalTypes} from "../../../../domain/ProposalTypes";
import {UserVote, VotesService, VotesWithQty} from "../../../services/votes.service";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-proposal-page',
  standalone: true,
  imports: [
    CalendarModule,
    NgForOf,
    NgIf,
    QuestionBadgeComponent,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    NgClass,
    DatePipe,
    NgbTooltip
  ],
  templateUrl: './proposal-page.component.html',
  styleUrl: './proposal-page.component.scss'
})
export class ProposalPageComponent {
  id: string | null;
  proposal!: Proposal
  selectedOptionId: number | null = null;
  activeOptionIndex: number | undefined;

  currentVotes!: VotesWithQty[]
  optionVoted!: UserVote
  totalVotes: number = 0;
  totalMembers: number = 0;
  alreadyVoted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proposalsService: ProposalsService,
    private votesService: VotesService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.getProposal()

  }


  getProposal() {
    this.proposalsService.getProposalById(this.id!).subscribe({
        next: proposal => {
          const proposalData = proposal.data

          if (!proposalData.id)
            this.swalErrorDisplay('Aquesta proposta no existeix.').then(() => {
              this.router.navigate(['/governance/proposals']);
            })

          this.proposal = proposalData
          this.getVoteFromUser()
          this.getTotalUsersByCommunity(proposalData.communityId)
          if (proposal.data.transparent == 1) this.getVotes()
        },
        error: (err) => {
          this.swalErrorDisplay('Hi ha hagut un error amb la proposta. Espera uns minuts i torna-ho a intentar.').then(() => {
            console.log("ERRROR", err)
          })
        }
      }
    )
  }

  getVotes() {
    this.votesService.getVotesByProposalId(this.proposal.id).subscribe({
        next: data => {
          const votes = data.data
          this.currentVotes = votes
          for (const vote of votes) {
            this.totalVotes += vote.qty
          }

          this.calculatePercentage()

        },
        error: err => {
          this.swalErrorDisplay('Hi ha hagut un error amb la proposta. Espera uns minuts i torna-ho a intentar.').then(() => {
            console.log("ERRROR", err)
          })
        }
      }
    )
  }

  getVoteFromUser() {
    this.votesService.getVotesByProposalIdAndUserId(this.proposal.id, 22).subscribe({
        next: data => {
          const vote = data.data
          this.optionVoted = vote
          const optionIndex = this.proposal.options?.findIndex(option => {
            return option.id == vote.optionId
          })

          if (optionIndex) {
            this.selectOption(this.optionVoted.optionId, optionIndex)
          }

          if (vote.optionId) this.alreadyVoted = true

        },
        error: err => {
          this.swalErrorDisplay('Hi ha hagut un error amb la proposta. Espera uns minuts i torna-ho a intentar.').then(() => {
            console.log("ERRROR", err)
          })
        }
      }
    )
  }

  getTotalUsersByCommunity(communityId: number) {
    this.votesService.getTotalCupsByCommunityId(communityId).subscribe({
      next: value => {
        this.totalMembers = value.data.total
      },
      error: err => {
        this.swalErrorDisplay('Hi ha hagut un error amb la proposta. Espera uns minuts i torna-ho a intentar.').then(() => {
          console.log("ERRROR", err)
        })
      }
    })
  }

  vote() {
    this.votesService.postVote(22, this.proposal.id, this.selectedOptionId!).subscribe({
      next: response => {
        console.log(response, "vote()")
        this.alreadyVoted = true;
      },
      error: err => {
        this.swalErrorDisplay('Hi ha hagut votant. Espera uns minuts i torna-ho a intentar.').then(() => {
          console.log("ERRROR", err)
        })
      }
    })
  }

  selectOption(id: number, index: number) {
    this.activeOptionIndex = index
    this.selectedOptionId = id
  }

  calculatePercentage() {
    for (const vote of this.currentVotes) {
      const votePercentage = (vote.qty * 100) / this.totalVotes

      for (const option of this.proposal.options!) {
        if (option.id == vote.optionId) option.percentage = votePercentage
      }
    }

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

  statusTranslation(status: ProposalStatus) {
    return this.proposalsService.statusTranslation(status)
  }

  typeTranslation(type: ProposalTypes) {
    return this.proposalsService.typeTranslation(type)
  }

  getStatusButtonClass(status: ProposalStatus) {
    switch (status.toLowerCase()) {
      case "active":
        return 'btn-outline-success'
      case "pending":
        return 'btn-outline-warning'
      case "succeeded":
        return 'btn-outline-success'
      case "executed":
        return 'btn-outline-tertiary'
      case "defeated":
        return 'btn-outline-danger'
      default:
        return 'btn-outline-tertiary'
    }
  }
}
