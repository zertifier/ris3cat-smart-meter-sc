import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./help-page/help-page.component').then(m => m.HelpPageComponent)
  }
]
