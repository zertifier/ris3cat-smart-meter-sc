import {Component} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {UserStoreService} from "../../services/user-store.service";

@Component({
  selector: 'app-user-wallet-page',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './user-wallet-page.component.html',
  styleUrl: './user-wallet-page.component.scss'
})
export class UserWalletPageComponent {
  wallet$ = this.userStore.selectOnly(state => state.user?.wallet_address)
    .pipe(wallet => wallet || 'No hi ha cap wallet assignada')
  constructor(private userStore: UserStoreService) {
  }
}
