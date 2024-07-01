import {Axios} from "axios";
import {HttpResponse} from "../../HttpResponse";

export interface RankingConsumption {
  customerId: number,
  walletAddress: string,
  consumption: number,
}
export interface RankingSurplus {
  customerId: number,
  walletAddress: string,
  surplus: number,
}

export class ZertipowerEnergyHourlyService {
  constructor(private readonly axios: Axios) {
  }

  async getRankingConsumption(communityId: number | string, dateByMonth: string){
    console.log(`/energy-hourly/ranking/consumption/${communityId}/${dateByMonth}`, "`/energy-hourly/ranking/consumption/${communityId}/${dateByMonth}`")
    const response = await this.axios.get<HttpResponse<RankingConsumption[]>>(`/energy-hourly/ranking/consumption/${communityId}/${dateByMonth}`);

    return response.data.data
  }

}
