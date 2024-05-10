import {Injectable} from "@angular/core";
import {Axios} from "axios";

export interface CustomerDTO {
  id: number,
  name: string,
  walletAddress: string,
  createdAt: number,
  updatedAt: number
}

@Injectable({
  providedIn: 'root'
})
export class ZertipowerCustomersService {
  constructor(private axios: Axios) {
  }

  public async get(): Promise<CustomerDTO[]> {
    const response = await this.axios.get('/customers');
    return response.data.data;
  }
}
