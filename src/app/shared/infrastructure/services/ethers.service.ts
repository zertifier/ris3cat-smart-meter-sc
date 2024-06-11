import {Injectable} from '@angular/core';
import {ZertiauthApiService} from "../../../features/auth/infrastructure/services/zertiauth-api.service";
import {AuthStoreService} from "../../../features/auth/infrastructure/services/auth-store.service";
import {BaseContract, Contract, ethers, getNumber, JsonRpcProvider, Wallet} from "ethers";
import {HttpResponse} from "./HttpResponse";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {firstValueFrom} from "rxjs";
import {Router} from "@angular/router";
import contractAbi from '../../../../assets/ethers/ERC20-abi.json';


interface Rpc {
  id: number;
  blockchainId: number;
  rpc: string;
  active: boolean;
  working: boolean;
  eventTransfer: boolean;
  createDt: string;  // ISO 8601 date string
  updateDt: string;  // ISO 8601 date string
}

interface RpcData {
  [key: string]: Rpc[];
}

@Injectable({
  providedIn: 'root'
})
export class EthersService {
  private rpc: string = ''
  rpcsBaseUrl = environment.zertirpcs_url || 'https://zertirpc.zertifier.com'

  constructor(
    private httpClient: HttpClient,
    private zertiauthApiService: ZertiauthApiService,
    private authStoreService: AuthStoreService,
    private router: Router
  ) {
  }


  async getWalletFromAuthPk() {
    const oAuthCode = this.authStoreService.getOauthCode()
    if (!oAuthCode){
      this.authStoreService.resetDefaults()
      const urlTree = this.router.createUrlTree(['/auth']);
      await this.router.navigateByUrl(urlTree);
    }

    try {
      const privateKeyResponse = await firstValueFrom(this.zertiauthApiService.getPrivateKey(oAuthCode))
      const provider = new JsonRpcProvider(await this.getWorkingRpc())

      return new Wallet(privateKeyResponse.privateKey, provider)
    }catch (error){
      console.log(error)
      return undefined
    }

  }

  getWorkingRpc(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.updateWorkingRpc().subscribe({
        next: (rpc) => {
          if (rpc.data) {
            const workingRpc = rpc.data['100'].find((element) => element.working === true);
            resolve(workingRpc?.rpc || environment.defaultRpc);
          } else {
            resolve(environment.defaultRpc);
          }
        },
        error: () => {
          resolve(environment.defaultRpc);
        }
      });
    });
  }

  updateWorkingRpc() {
    return this.httpClient.get<HttpResponse<RpcData>>(`${this.rpcsBaseUrl}/100/rpc`)
  }

  async getEkwBalance(walletAddress: string){
    try {
      const provider = new JsonRpcProvider(await this.getWorkingRpc())

      const contract = new Contract(environment.erc20_contract, contractAbi, provider)

      // @ts-ignore
      return getNumber(await contract.balanceOf(walletAddress))
    }catch (error){
      console.log(error, "ERROR")
      return 0
    }
  }
}
