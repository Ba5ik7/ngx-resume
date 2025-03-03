import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { InfoPanelComponent } from './components/info-panel.component';
import { ProjectsService } from './services/projects.service';
import { GithubReposResolver } from './services/github.service';
import { ProjectsComponent } from './projects.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'github/0',
    pathMatch: 'full',
  },
  // http://localhost/projects/github/0
  {
    path: 'github',
    component: ProjectsComponent,
    resolve: {
      repos: GithubReposResolver,
    },
    children: [
      {
        path: ':id',
        component: InfoPanelComponent,
        data: { animation: 'InfoPanelPage', alwaysRefresh: true },
        resolve: {
          project: (route: ActivatedRouteSnapshot) => {
            const projectsService = inject(ProjectsService);
            const projectId = parseInt(route.paramMap.get('id')!, 10);
            projectsService.currentProject.next(projectId);
            return projectId;
          },
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/project/0',
    pathMatch: 'full',
  },
];
