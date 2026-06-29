import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [PublicGuard],
    loadComponent: () => import('./feature-auth/pages/page-auth/page-auth.component')
  },
  {
    path: 'companies',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature-companies/companies.routes')
  },
  {
    path: 'contacts',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature-contacts/contacts.routes')
  },
  {
    path: '**',
    loadComponent: () => import('./feature-not-found/pages/page-not-found/page-not-found.component')
  }
];
