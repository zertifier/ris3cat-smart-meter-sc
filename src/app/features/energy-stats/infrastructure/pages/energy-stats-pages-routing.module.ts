import {Routes} from "@angular/router";
import {switchChartEntityGuard} from "../guards/switch-chart-entity.guard";
import {ChartEntity} from "../../domain/ChartEntity";
import {hasCupsGuard} from "../guards/has-cups.guard";
import {hasCommunityGuard} from "../guards/has-community.guard";

export enum ENERGY_STATS_ROUTE_NAMES {
  STATS_COMMUNITY = 'stats-community',
  STATS_CUPS = 'stats-cups',
  MISSING_COMMUNITY = 'missing-community',
  MISSING_CUPS = 'missing-cups',
  GOVERNANCE = 'GOVERNANCE'
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../../../core/layouts/navbar-layout/navbar-layout.component').then(c => c.NavbarLayoutComponent),
    children: [
      {
        path: 'community',
        loadComponent: () => import('./my-community-page/my-community-page.component').then(c => c.MyCommunityPageComponent),
        canActivate: [switchChartEntityGuard(ChartEntity.COMMUNITIES), hasCommunityGuard],
        data: {
          name: ENERGY_STATS_ROUTE_NAMES.STATS_COMMUNITY
        }
      },
      {
        path: 'my-cup',
        loadComponent: () => import('./my-cup-page/my-cup-page.component').then(c => c.MyCupPageComponent),
        canActivate: [switchChartEntityGuard(ChartEntity.CUPS), hasCupsGuard],
        data: {
          name: ENERGY_STATS_ROUTE_NAMES.STATS_CUPS
        }
      },
      {
        path: 'community/missing',
        loadComponent: () => import('./missing-community-page/missing-community-page.component').then(c => c.MissingCommunityPageComponent),
        canActivate: [hasCommunityGuard],
        data: {
          name: ENERGY_STATS_ROUTE_NAMES.MISSING_COMMUNITY
        }
      },
      {
        path: 'my-cup/missing',
        loadComponent: () => import('./missing-cup-page/missing-cup-page.component').then(c => c.MissingCupPageComponent),
        canActivate: [hasCupsGuard],
        data: {
          name: ENERGY_STATS_ROUTE_NAMES.MISSING_CUPS
        }
      },
      {
        path: 'share',
        loadComponent: () => import('./share-page/share-page.component').then(c => c.SharePageComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'community'
      }
    ]
  },


];
