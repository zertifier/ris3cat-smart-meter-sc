import {Axios} from "axios";
import {HttpResponse} from "../../HttpResponse";

export class ZertipowerAuthService {
  constructor(private readonly axios: Axios) {
  }

  async register(params: {
    wallet_address: string, private_key: string, email: string, name: string, lastname: string, dni?: string
  }): Promise<{
    accessToken: string,
    refreshToken: string
  }> {
    const {dni, name, lastname, wallet_address, email, private_key} = params;
    const response = await this.axios.post<HttpResponse<{
      access_token: string,
      refresh_token: string
    }>>(`/auth/web-wallet-register`, {wallet_address, private_key, email, dni, firstname: name, lastname})

    return {
      accessToken: response.data.data.access_token,
      refreshToken: response.data.data.refresh_token
    };
  }

  async login(walletAddress: string, signature: string, email: string): Promise<{
    accessToken: string,
    refreshToken: string
  }> {
    const response = await this.axios.post<HttpResponse<{
      access_token: string,
      refresh_token: string
    }>>(`/auth/login-w3`, {wallet_address: walletAddress, signature, email})

    return {
      accessToken: response.data.data.access_token,
      refreshToken: response.data.data.refresh_token
    };
  }

}
