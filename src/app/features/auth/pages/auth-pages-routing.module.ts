import { Routes } from '@angular/router';

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
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];
