import {Component} from '@angular/core';
import {ProposalOption, ProposalsService, SaveProposal} from "../../../services/proposals.service";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import Swal from "sweetalert2";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {UserStoreService} from "../../../../../user/infrastructure/services/user-store.service";
import {CalendarModule} from "primeng/calendar";
import dayjs from "dayjs";
import {ProposalStatus} from "../../../../domain/ProposalStatus";
import {ProposalTypes} from "../../../../domain/ProposalTypes";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {
  QuestionBadgeComponent
} from "../../../../../../shared/infrastructure/components/question-badge/question-badge.component";

@Component({
  selector: 'app-new-proposal-page',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    AsyncPipe,
    CalendarModule,
    NgForOf,
    NgbTooltip,
    RouterLink,
    RouterLinkActive,
    QuestionBadgeComponent
  ],
  templateUrl: './new-proposal-page.component.html',
  styleUrl: './new-proposal-page.component.scss'
})
export class NewProposalPageComponent {

  proposal!: string;
  proposalDescription!: string;
  loading: boolean = false
  userId!: number;
  communityId!: number;
  status: ProposalStatus = 'active';
  type: ProposalTypes = 'weighted';
  minVotes: number = 50;
  transparentStatus: boolean = false;
  date: Date = dayjs().add(1, 'day').toDate();
  minDate: Date = dayjs().add(1, 'day').toDate();
  options: any = [  {option: 'Sí'}, {option: 'No'}, {option: 'Abstenir-se'},]

  constructor(
    private proposalsService: ProposalsService,
    private router: Router,
    private readonly userStore: UserStoreService,
  ) {
    this.userStore
      .selectOnly(state => state).subscribe((data) => {
      if (data.cups.length) {
        this.communityId = data.cups[0].communityId
      }
      if (data.user) {
        this.userId = data.user.id
      }
    })


  }

  /* setDate(date: Date){
     // this.selectedDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
     this.selectedDate = dayjs(date).format('YYYY-MM-DD')
   }*/
  setTransparentStatus() {
    this.transparentStatus = !this.transparentStatus
  }

  addOption() {
    this.options.unshift({})
  }

  removeOption(index: number) {
    console.log(this.options)
    this.options.splice(index, 1)
  }

  saveProposal() {
    this.loading = true;
    const proposal: SaveProposal = {
      userId: this.userId,
      communityId: this.communityId || 0,
      expirationDt: dayjs(this.date).format('YYYY-MM-DD'),
      status: 'active',
      proposal: this.proposal,
      description: this.proposalDescription,
      quorum: this.minVotes / 100,
      transparent: this.transparentStatus ? 1 : 0,
      type: this.type
    }
    this.proposalsService.saveProposal(proposal).subscribe(
      (savedProposal) => {
        let proposalOptions: ProposalOption[] = [];

        for (const option of this.options) {
          proposalOptions.push({
            option: option.option,
            proposalId: savedProposal.data.id!
          })
        }
        this.proposalsService.saveProposalOption(proposalOptions).subscribe(
          (savedProposalOption) => {
            Swal.fire({
              icon: 'success',
              title: 'Proposta guardada correctament',
              confirmButtonText: 'Entès',
              customClass: {
                confirmButton: 'btn btn-secondary-force'
              }
            }).then(() => {
              console.log(savedProposalOption)
              console.log(proposal, "proposal")
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
            }).then(() => {
              this.loading = false
              console.log("ERRROR", error)
            })
          })
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
        }).then(() => {
          this.loading = false
          console.log("ERRROR", error)
        });

      })
  }

}
