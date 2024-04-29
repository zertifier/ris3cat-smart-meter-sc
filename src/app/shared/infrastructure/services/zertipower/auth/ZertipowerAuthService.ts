import {Axios} from "axios";
import {HttpResponse} from "../../HttpResponse";

export class ZertipowerAuthService {
  constructor(private readonly axios: Axios) {
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
