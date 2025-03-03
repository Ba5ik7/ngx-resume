import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { CampGroundSceneComponent } from './components/camp-ground-scene.component';
import { ProjectsService } from './services/projects.service';
import { AsyncPipe } from '@angular/common';
import { NavBarComponent } from './components/nav-bar.component';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterOutlet, NavBarComponent, CampGroundSceneComponent],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate(
          '300ms 1300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
  template: `
    <app-nav-bar></app-nav-bar>
    <main>
      <camp-ground-scene
        [currentProject]="(this.projectsService.curentProject$ | async) ?? 0"
        (projectIndexChanged)="router.navigate(['/projects/github', $event])"
      ></camp-ground-scene>
      <div [@routeAnimations]="getRouteState(outlet)">
        <router-outlet #outlet="outlet"></router-outlet>
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        overflow-y: hidden;

        main {
          display: flex;
          flex-direction: column;
          align-items: center;
          camp-ground-scene {
            position: absolute;
          }
        }
        app-nav-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
        }
      }
    `,
  ],
})
export class ProjectsComponent {
  router = inject(Router);
  projectsService = inject(ProjectsService);

  getRouteState(outlet: RouterOutlet) {
    if (!outlet.activatedRouteData?.['animation']) return null;
    const paramId = outlet.activatedRoute?.snapshot.paramMap.get('id') ?? '';
    return outlet.activatedRouteData['animation'] + paramId;
  }
}
