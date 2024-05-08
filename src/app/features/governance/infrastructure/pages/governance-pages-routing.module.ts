import {Routes} from "@angular/router";
import {ENERGY_STATS_ROUTE_NAMES} from "../../../energy-stats/infrastructure/pages/energy-stats-pages-routing.module";


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../../../core/layouts/navbar-layout/navbar-layout.component').then(c => c.NavbarLayoutComponent),
    children: [
      {
        path: 'governance',
        loadComponent: () => import('./governance-page/governance-page.component').then(c => c.GovernancePageComponent),
        data: {
          name: ENERGY_STATS_ROUTE_NAMES.GOVERNANCE,
        }
      },
      {
        path: 'proposals',
        loadComponent: () => import('./proposals-page/proposals-page.component').then(c => c.ProposalsPageComponent),
        data: {
          name: ENERGY_STATS_ROUTE_NAMES.GOVERNANCE,
        }
      },
      {
        path: 'proposals/new-proposal',
        loadComponent: () => import('./proposals-page/new-proposal-page/new-proposal-page.component').then(c => c.NewProposalPageComponent),
        data: {
          name: ENERGY_STATS_ROUTE_NAMES.GOVERNANCE,
        }
      }
    ]
  }
]
