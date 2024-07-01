import {Component, OnDestroy} from '@angular/core';
import {ZertipowerService} from "@shared/infrastructure/services/zertipower/zertipower.service";
import {
  RankingConsumption
} from "@shared/infrastructure/services/zertipower/energy-hourly/ZertipowerEnergyHourlyService";
import {UserStoreService} from "../../../../user/infrastructure/services/user-store.service";
import dayjs from "dayjs";
import {Subscription} from "rxjs";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {TextShorterPipe} from "@shared/infrastructure/pipes/wallet-address-shortener.pipe";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    TextShorterPipe,
    CalendarModule,
    FormsModule
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnDestroy{

  data!: RankingConsumption[]
  communityId!: number;
  customerId!: number;
  userName: string = ''
  loading = true

  date: Date = dayjs().toDate();
  maxDate: Date = dayjs().toDate();

  subscriptions: Subscription[] = [];
  constructor(
    private readonly zertipower: ZertipowerService,
    private userStore: UserStoreService,
    ) {


    this.subscriptions.push(
      this.userStore.selectOnly(this.userStore.$.communityId).subscribe((community) => {
        this.communityId = community
        if (this.communityId)
          this.getConsumptionData()
      }),
      this.userStore
        .selectOnly(state => state).subscribe((data) => {
        if (data.user) {
          console.log(data.user)
          this.userName = (data.user.firstname + " " + data.user.lastname)
          this.customerId = data.user.customer_id!;
        }
      })
    )
  }


  async getConsumptionData(){
    const currentDateMonth = dayjs().format('YYYY-MM')
    this.data = await this.zertipower.energyHourly.getRankingConsumption(this.communityId, '2024-06')
    this.loading = false
    console.log(this.data)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
}
