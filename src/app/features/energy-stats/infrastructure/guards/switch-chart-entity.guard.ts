import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {ChartStoreService} from "../services/chart-store.service";
import {ChartEntity} from "../../domain/ChartEntity";

export function switchChartEntityGuard(resource: ChartEntity): CanActivateFn {
  return (route, state) => {
    const chartStoreService = inject(ChartStoreService);
    chartStoreService.patchState({selectedChartEntity: resource});
    return true;
  }
}
