import {Routes} from '@angular/router';
import {triedLoginGuard} from "../guards/tried-login.guard";

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'oauth-callback',
    loadComponent: () => import('./login-callback/login-callback.component').then(m => m.LoginCallbackComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register-page/register-page.component').then(m => m.RegisterPageComponent),
    canActivate: [triedLoginGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];
