import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/pages/auth-pages-routing.module').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'energy-stats',
    loadChildren: () => import('./features/energy-stats/pages/energy-stats-pages-routing.module').then(m => m.ENERGY_STATS_ROUTES)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth'
  }
];
