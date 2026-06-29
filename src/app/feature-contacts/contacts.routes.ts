import { Routes } from '@angular/router';

const contactsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/page-list-contacts/page-list-contacts.component')
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/page-add-contact/page-add-contact.component')
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/page-edit-contact/page-edit-contact.component')
  }
];

export default contactsRoutes;
