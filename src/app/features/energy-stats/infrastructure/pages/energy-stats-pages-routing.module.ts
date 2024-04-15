import {Routes} from "@angular/router";
import {switchChartEntityGuard} from "../guards/switch-chart-entity.guard";
import {ChartEntity} from "../../domain/ChartEntity";
import {profileLoadedGuard} from "../../../user/profile-loaded.guard";

export const ENERGY_STATS_ROUTES: Routes = [
  {
    path: 'community',
    loadComponent: () => import('./my-community-page/my-community-page.component').then(m => m.MyCommunityPageComponent),
    canActivate: [switchChartEntityGuard(ChartEntity.COMMUNITIES), profileLoadedGuard]
  },
  {
    path: 'my-cup',
    loadComponent: () => import('./my-cup-page/my-cup-page.component').then(m => m.MyCupPageComponent),
    canActivate: [switchChartEntityGuard(ChartEntity.CUPS), profileLoadedGuard]
  },
  {
    path: 'share',
    loadComponent: () => import('./share-page/share-page.component').then(m => m.SharePageComponent)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'community'
  }
];
