import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '',
    pathMatch: 'full' ,
    loadComponent: () => import('./command-line/command-line.component').then(m => m.CommandLineComponent)
  },
  { path: '**', redirectTo: '404' }
];
