import {Component, OnDestroy} from '@angular/core';
import {AsyncPipe, DecimalPipe} from "@angular/common";
import {UserStoreService} from "../../services/user-store.service";
import {EthersService} from "../../../../../shared/infrastructure/services/ethers.service";
import {FormsModule} from "@angular/forms";
import {
  QuestionBadgeComponent
} from "../../../../../shared/infrastructure/components/question-badge/question-badge.component";
import {Subscription} from "rxjs";
import {VotesService} from "../../../../governance/infrastructure/services/votes.service";
import Swal from "sweetalert2";
import {DaoService} from "../../../../governance/infrastructure/services/dao.service";

@Component({
  selector: 'app-user-wallet-page',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    QuestionBadgeComponent,
    DecimalPipe
  ],
  templateUrl: './user-wallet-page.component.html',
  styleUrl: './user-wallet-page.component.scss'
})
export class UserWalletPageComponent implements OnDestroy {
  wallet$ = this.userStore.selectOnly(state => state.user?.wallet_address)
    .pipe(wallet => wallet || 'No hi ha cap wallet assignada')

  userStore$ = this.userStore.selectOnly(state => state)

  ekwBalance: number = 0
  chainBalance: number = 0
  voteWeight: number = 0
  subscriptions: Subscription[] = [];
  communityId!: number
  customerId!: number

  constructor(
    private userStore: UserStoreService,
    private ethersService: EthersService,
    private votesService: VotesService,
    private daoService: DaoService
  ) {
    /*this.subscriptions.push(
      this.wallet$.subscribe((wallet) => {
        if (wallet)
          this.getAllBalances(wallet)
      })
    )*/

    this.subscriptions.push(
      this.userStore$.subscribe((store) => {
        if (store && store.cups[0] && store.user?.wallet_address){
          this.communityId = store.cups[0].communityId
          this.customerId = store.user?.customer_id!
          this.getAllBalances(store.user?.wallet_address)
        }
      })
    )
  }

  getAllBalances(wallet: string) {
    this.ethersService.getEKWBalance(wallet,).then((balance) => {
      this.ekwBalance = balance
    })
    this.ethersService.getChainBalance(wallet).then((balance) => {
      this.chainBalance = balance
    })
    this.daoService.getDaoBalance(wallet, this.communityId).then((balance) => {
      this.voteWeight = balance
    })

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

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
}
