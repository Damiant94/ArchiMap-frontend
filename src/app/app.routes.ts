import { Routes } from '@angular/router';
import { unknownRouteGuard } from './_guards/unknownRoute/unknown-route.guard';

export const routes: Routes = [
  {
    path: '',
    children: []
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./object-details/object-details.component').then(
        (m) => m.ObjectDetailsComponent
      ),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./object-add/object-add.component').then(
        (m) => m.ObjectAddComponent
      ),
  },
  {
    path: '**',
    canMatch: [unknownRouteGuard],
    children: []
  },
];
