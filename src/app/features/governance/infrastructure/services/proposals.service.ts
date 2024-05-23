import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpResponse} from "../../../../shared/infrastructure/services/HttpResponse";
import {environment} from "../../../../../environments/environment";
import {ProposalStatus} from "../../domain/ProposalStatus";
import {ProposalTypes} from "../../domain/ProposalTypes";


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
  type: ProposalTypes;
  transparent: number;
  quorum: number;
  options?: ProposalOption[];
  createdAt: string;
  updatedAt: string;
}

export interface SaveProposal {
  id?: number,
  userId: number,
  communityId: number,
  proposal: string,
  description: string,
  expirationDt: string,
  status: ProposalStatus,
  transparent: number,
  quorum: number,
  type: ProposalTypes
}

export interface ProposalOption {
  id?: number,
  proposalId: number,
  option: string,
  percentage: number | 0 | undefined
}

@Injectable({
  providedIn: 'root'
})
export class ProposalsService {

  baseUrl = environment.zertipower_url
  // baseUrl= 'http://localhost:3000'
  constructor(
    private httpClient: HttpClient,
  ) { }

  getProposals(){
   return this.httpClient.get<HttpResponse<Proposal[]>>(`${this.baseUrl}/proposals`)
  }
  getProposalsByCommunity(communityId: number){
   return this.httpClient.get<HttpResponse<Proposal[]>>(`${this.baseUrl}/proposals/community/${communityId}`)
  }
  getProposalsByStatus(status: ProposalStatus){
   return this.httpClient.get<HttpResponse<Proposal[]>>(`${this.baseUrl}/proposals/status/${status}`)
  }
  getProposalsByStatusAndCommunity(communityId: number, status: ProposalStatus){
   return this.httpClient.get<HttpResponse<Proposal[]>>(`${this.baseUrl}/proposals/community/${communityId}/status/${status}`)
  }
  getProposalsByFilter(word: string){
   return this.httpClient.get<HttpResponse<Proposal[]>>(`${this.baseUrl}/proposals/filter/${word}`)
  }
  getProposalsByFilterAndCommunity(communityId:number ,word: string){
   return this.httpClient.get<HttpResponse<Proposal[]>>(`${this.baseUrl}/proposals/community/${communityId}/filter/${word}`)
  }
  getProposalsByFilterStatus(word: string, status: ProposalStatus | ''){
   return this.httpClient.get<HttpResponse<Proposal[]>>(`${this.baseUrl}/proposals/filter/${word}/status/${status}`)
  }

  getProposalsByFilterStatusCommunity(communityId: number, word: string, status: ProposalStatus | ''){
   return this.httpClient.get<HttpResponse<Proposal[]>>(`${this.baseUrl}/proposals/community/${communityId}/filter/${word}/status/${status}`)
  }

  getProposalById(id: string){
    return this.httpClient.get<HttpResponse<Proposal>>(`${this.baseUrl}/proposals/${id}`)
  }

  saveProposal(proposal: SaveProposal){
    return this.httpClient.post<HttpResponse<SaveProposal>>(`${this.baseUrl}/proposals`, proposal)
  }
  saveProposalOption(proposalOption: ProposalOption[]){
    return this.httpClient.post<HttpResponse<ProposalOption[]>>(`${this.baseUrl}/proposals-options`, proposalOption)
  }

  updateStatus(proposalId: number, status: ProposalStatus){
    return this.httpClient.put<HttpResponse<ProposalOption[]>>(`${this.baseUrl}/proposals/${proposalId}/status`, {status})
  }

  deleteProposal(proposalId: number){
    return this.httpClient.delete<HttpResponse<ProposalOption[]>>(`${this.baseUrl}/proposals/${proposalId}`)
  }

  statusTranslation(status: ProposalStatus){
    switch (status.toLowerCase()){
      case "active": return 'Actiu'
      case "pending": return 'Pendent'
      case "succeeded": return 'Acceptada'
      case "executed": return 'Executada'
      case "expired": return 'Finalitzada'
      case "denied": return 'Denegada'
      default: return
    }
  }

  typeTranslation(type: ProposalTypes){
    switch (type.toLowerCase()){
      case "weighted": return 'Ponderada'
      case "equal": return 'Igualitaria'
      default: return
    }
  }
}
