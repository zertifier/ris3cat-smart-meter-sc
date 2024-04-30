import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpResponse} from "../../../../shared/infrastructure/services/HttpResponse";
import {environment} from "../../../../../environments/environment";
import {ProposalStatus} from "../../domain/ProposalStatus";


export interface Proposal {
  id: number;
  proposal: string;
  description: string;
  communityId: number;
  expirationDt: string;
  status: ProposalStatus;
  firstname: string;
  email: string;
  walletAddress: string;
  type: string;
  transparent: number;
  quorum: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProposalsService {

  // baseUrl = environment.api_url
  baseUrl= 'http://localhost:3000'
  constructor(
    private httpClient: HttpClient,
  ) { }

  getProposals(){
   return this.httpClient.get<HttpResponse<Proposal[]>>(`${this.baseUrl}/proposals`)
  }
  getProposalsByStatus(status: ProposalStatus){
   return this.httpClient.get<HttpResponse<Proposal[]>>(`${this.baseUrl}/proposals/status/${status}`)
  }
}
