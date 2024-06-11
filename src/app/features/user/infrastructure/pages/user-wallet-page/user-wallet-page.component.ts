import {Component} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {UserStoreService} from "../../services/user-store.service";
import {EthersService} from "../../../../../shared/infrastructure/services/ethers.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-wallet-page',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule
  ],
  templateUrl: './user-wallet-page.component.html',
  styleUrl: './user-wallet-page.component.scss'
})
export class UserWalletPageComponent {
  wallet$ = this.userStore.selectOnly(state => state.user?.wallet_address)
    .pipe(wallet => wallet || 'No hi ha cap wallet assignada')

  ekwBalance: number = 0
  constructor(private userStore: UserStoreService, private ethersService: EthersService) {
    this.wallet$.subscribe((wallet) => {
      if (wallet)
        this.ethersService.getEkwBalance(wallet).then((balance) => {
          this.ekwBalance = balance
        })

    })
  }
}
