import { Injectable } from '@angular/core';
import {Contract, ContractFactory, ethers, getNumber, JsonRpcProvider} from "ethers";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {HttpResponse} from "../../../../shared/infrastructure/services/HttpResponse";
import {UserStoreService} from "../../../user/infrastructure/services/user-store.service";
import contractAbi from '../../../../../assets/ethers/DAO-abi.json';
import contractBytecode from '../../../../../assets/ethers/DAO-bytecode.json';
import {EthersService} from "../../../../shared/infrastructure/services/ethers.service";




@Injectable({
  providedIn: 'root'
})
export class DaoService {

  constructor(
    private httpClient: HttpClient,
    private userStore: UserStoreService,
    private ethersService: EthersService,
  ) {

    const user = this.userStore.snapshotOnly(state => state);
    if (!user) {
      return
    }

  }
  // baseUrl = environment.zertipower_url
  baseUrl= 'http://localhost:3000'

  postDao(communityId: number, daoInfo: {daoAddress: string, daoName: string, daoSymbol: string}){
    return this.httpClient.post<HttpResponse<any>>(`${this.baseUrl}/communities/${communityId}/dao`, daoInfo)
  }

  async createContract(name: string, symbol: string){
    const user = this.userStore.snapshotOnly(state => state.user);
    if (!user) {
      return
    }

    try {
      let contractFactory = new ContractFactory(contractAbi, contractBytecode.bytecode, user.wallet)
      let contract = await (await contractFactory.deploy(name, symbol)).waitForDeployment()
      return contract.target
    }catch (error){
      return
    }

  }

  async getDaoBalance(walletAddress: string, communityId: number){
    return new Promise<number>(resolve => {
      try {

        const provider = new JsonRpcProvider(this.ethersService.getCurrentRpc())

        this.httpClient.get<HttpResponse<any>>(`${this.baseUrl}/communities/${communityId}`).subscribe({
          next: async (community) => {
            console.log(community)
            const contract = new Contract(community.data.daoAddress, contractAbi, provider)

            // @ts-ignore
            resolve(getNumber(await contract.balanceOf(walletAddress)))
          },
          error: (error) => {
            resolve(0)
          }
        })


      } catch (error) {
        console.log(error, "ERROR")
        resolve(0)
      }
    })

  }



}
