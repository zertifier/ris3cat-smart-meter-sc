import {Routes} from "@angular/router";

export const ENERGY_STATS_ROUTES: Routes = [
  {
    path: 'community',
    loadComponent: () => import('./my-community-page/my-community-page.component').then(m => m.MyCommunityPageComponent)
  },
  {
    path: 'my-cup',
    loadComponent: () => import('./my-community-page/my-community-page.component').then(m => m.MyCommunityPageComponent)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'community'
  }
];
