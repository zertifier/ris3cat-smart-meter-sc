import {Routes} from '@angular/router';
import {LoggedInGuard} from "./features/auth/infrastructure/guards/LoggedInGuard";
import {LoggedOutGuard} from "./features/auth/infrastructure/guards/logged-out.guard";

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/infrastructure/pages/auth-pages-routing.module').then(m => m.AUTH_ROUTES),
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'energy-stats',
    loadChildren: () => import('./features/energy-stats/infrastructure/pages/energy-stats-pages-routing.module').then(m => m.routes),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'governance',
    loadChildren: () => import('./features/governance/infrastructure/pages/governance-pages-routing.module').then(m => m.routes),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/infrastructure/pages/user-pages-routing.module').then(m => m.routes),
    canActivate: [LoggedInGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth'
  }
];
