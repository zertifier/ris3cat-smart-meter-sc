import { Routes } from '@angular/router';
import {LoggedInGuard} from "./features/auth/guards/LoggedInGuard";
import {LoggedOutGuard} from "./features/auth/guards/logged-out.guard";

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/pages/auth-pages-routing.module').then(m => m.AUTH_ROUTES),
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'energy-stats',
    loadChildren: () => import('./features/energy-stats/infrastructure/pages/energy-stats-pages-routing.module').then(m => m.ENERGY_STATS_ROUTES),
    canActivate: [LoggedInGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth'
  }
];
