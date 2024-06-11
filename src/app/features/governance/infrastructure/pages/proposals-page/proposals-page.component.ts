import {Component, OnDestroy} from '@angular/core';
import {Proposal, ProposalsService} from "../../services/proposals.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ProposalStatus} from "../../../domain/ProposalStatus";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UserStoreService} from "../../../../user/infrastructure/services/user-store.service";
import {htmlToText} from "html-to-text";
import {Subscription} from "rxjs";
import {state} from "@angular/animations";
import {DaoService} from "../../services/dao.service";
import Swal from "sweetalert2";
import {EthersService} from "../../../../../shared/infrastructure/services/ethers.service";

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
export class ProposalsPageComponent implements OnDestroy{

  proposals: Proposal[] = []
  proposalType: ProposalType = 'all'
  communityId!: number
  userRole: string | undefined = ''
  filterText!: string

  subscriptions: Subscription[] = [];
  constructor(
    private proposalsService: ProposalsService,
    private userStore: UserStoreService,
    private daoService: DaoService,
    private ethersService: EthersService,
  ) {

    this.subscriptions.push(
      this.userStore.selectOnly(this.userStore.$.communityId).subscribe((community) => {
        this.communityId = community
        this.getAllProposals()
      }),
      this.userStore
        .selectOnly(state => state).subscribe((data) => {
        if (data.user) {
          this.userRole = data.user?.role;
        }
      })
    )
  }

  getAllProposals() {
    if (this.filterText) {
      this.subscriptions.push(
        this.proposalsService.getProposalsByFilterAndCommunity(this.communityId, this.filterText).subscribe((response) => {
          this.proposals = response.data.length ? response.data : []
          this.proposalType = 'all'
        })
      )
    } else {
      this.subscriptions.push(
        this.proposalsService.getProposalsByCommunity(this.communityId).subscribe((response) => {
          this.proposals = response.data.length ? response.data : []
          this.proposalType = 'all'
        })
      )
    }
  }

  getProposalsByStatus(status: ProposalStatus) {
    if (this.filterText) {
      this.subscriptions.push(
        this.proposalsService.getProposalsByFilterStatusCommunity(this.communityId, this.filterText || '', status).subscribe((response) => {
          this.proposals = response.data.length ? response.data : []
          this.proposalType = status
        })
      )
    } else {
      this.subscriptions.push(
        this.proposalsService.getProposalsByStatusAndCommunity(this.communityId, status).subscribe((response) => {
          this.proposals = response.data.length ? response.data : []
          this.proposalType = status
        })
      )
    }
  }

  getDescriptionText(htmlText: string) {
    return htmlToText(htmlText, {wordwrap: 150, baseElements: {selectors: ['p']}})
  }

  statusTranslation(status: ProposalStatus) {
    return this.proposalsService.statusTranslation(status)
  }

  createDao(){
   /* this.ethersService.getWorkingRpc().subscribe({
      next: (response) => {
        console.log(response, "RESPONSE")

        if (response.data){
          response.data['100'].find((element) => element.working = true)
        }
        Swal.fire({
          icon: 'success',
          title: 'DAO creada correctament'
        })
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Hi ha hagut un error creant la DAO'
        })
      }
    })*/


    // this.daoService.postDao(this.communityId, {daoAddress: '0x', daoName: 'DAO CCE Montolivet', daoSymbol: 'CCE1'}).subscribe({
    //   next: (response) => {
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'DAO creada correctament'
    //     })
    //   },
    //   error: (error) => {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Hi ha hagut un error creant la DAO'
    //     })
    //   }
    // })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

}
