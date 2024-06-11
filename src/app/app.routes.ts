import { Routes } from '@angular/router';
import { ObjectDetailsComponent } from './object-details/object-details.component';
import { ObjectAddComponent } from './object-add/object-add.component';

export const routes: Routes = [
    { path: 'details/:id', component: ObjectDetailsComponent },
    { path: 'add', component: ObjectAddComponent },
];
