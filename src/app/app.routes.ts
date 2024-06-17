import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'details/:id', loadComponent: () => import ('./object-details/object-details.component').then((m) => m.ObjectDetailsComponent) },
    { path: 'add', loadComponent: () => import ('./object-add/object-add.component').then((m) => m.ObjectAddComponent) },
];
