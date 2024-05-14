import { Injectable } from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {HttpResponse} from "../../../../shared/infrastructure/services/HttpResponse";

export interface VotesWithQty {
  optionId: number,
  qty: number
}

export interface UserVote{
  optionId: number
}
@Injectable({
  providedIn: 'root'
})
export class VotesService {
  // baseUrl = environment.zertipower_url
  baseUrl= 'http://localhost:3000'

  constructor(
    private httpClient: HttpClient,
  ) { }

  getVotesByProposalId(proposalId: number){
    console.log(`${this.baseUrl}/votes/proposal/${proposalId}`)
    return this.httpClient.get<HttpResponse<VotesWithQty[]>>(`${this.baseUrl}/votes/proposal/${proposalId}`)
  }
  getVotesByProposalIdAndUserId(proposalId: number, userId: number){
    return this.httpClient.get<HttpResponse<UserVote>>(`${this.baseUrl}/votes/proposal/${proposalId}/user/${userId}`)
  }
}
