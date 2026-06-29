import { Routes } from '@angular/router';

const companiesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/page-list-companies/page-list-companies.component')
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/page-add-compay/page-add-compay.component')
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/page-edit-company/page-edit-company.component')
  }
];

export default companiesRoutes;
