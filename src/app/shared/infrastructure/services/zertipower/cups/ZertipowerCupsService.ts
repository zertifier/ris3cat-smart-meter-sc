import {Axios} from "axios";
import {HttpResponse} from "../../HttpResponse";

export class ZertipowerCupsService {
  constructor(private axios: Axios) {
  }

  async datadisActive(cupsId: number) {
    const response = await this.axios.get<HttpResponse<{ active: boolean }>>(`/cups/datadis-active/${cupsId}`);
    const body = response.data;

    const { active } = body.data;

    return active;
  }
}
