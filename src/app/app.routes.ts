import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
  Routes,
} from '@angular/router';
import { GithubReposResolver } from './projects/services/github.service';

@Injectable({ providedIn: 'root' })
export class DemoReuseStrategy extends RouteReuseStrategy {
  retrieve(): DetachedRouteHandle | null {
    return null;
  }
  shouldAttach(): boolean {
    return false;
  }
  shouldDetach(): boolean {
    return false;
  }
  store(): void {}
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    if (future.routeConfig === curr.routeConfig) {
      return !future.data['alwaysRefresh'];
    } else {
      return false;
    }
  }
}

export const routes: Routes = [
  {
    path: '404',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./command-line/command-line.component').then(
        (m) => m.CommandLineComponent
      ),
  },
  {
    path: 'projects',
    resolve: {
      repos: GithubReposResolver,
    },
    loadChildren: () => import('./projects/projects.routes').then(m => m.routes)
  },
  { path: '**', redirectTo: '404' },
];
