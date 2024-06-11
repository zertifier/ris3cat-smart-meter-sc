import { Injectable } from '@angular/core';
import {ContractFactory, ethers} from "ethers";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {HttpResponse} from "../../../../shared/infrastructure/services/HttpResponse";
import {UserStoreService} from "../../../user/infrastructure/services/user-store.service";
import * as contractAbi from '../../../../../assets/ethers/DAO-abi.json';
import * as contractBytecode from '../../../../../assets/ethers/DAO-bytecode.json';




@Injectable({
  providedIn: 'root'
})
export class DaoService {

  constructor(
    private httpClient: HttpClient,
    private userStore: UserStoreService,
  ) {

    const user = this.userStore.snapshotOnly(state => state);
    if (!user) {
      return
    }

    console.log(user, "user")
  }
  // baseUrl = environment.zertipower_url
  baseUrl= 'http://localhost:3000'
  rpcsBaseUrl = environment.zertirpcs_url || 'https://zertirpc.zertifier.com'

  postDao(communityId: number, daoInfo: {daoAddress: string, daoName: string, daoSymbol: string}){
    return this.httpClient.post<HttpResponse<any>>(`${this.baseUrl}/communities/${communityId}/dao`, daoInfo)
  }

  createContract(){
    const user = this.userStore.snapshotOnly(state => state.user);
    if (!user) {
      return
    }

    const contract = new ContractFactory(contractAbi, contractBytecode.bytecode, user.wallet)
  }



}
