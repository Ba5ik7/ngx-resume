import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map } from "rxjs";
import { GithubService } from "./github.service";



@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  currentProject = new BehaviorSubject<number>(0);
  curentProject$ = this.currentProject.asObservable();

    curentProjectRepo$ = combineLatest([
      inject(GithubService).repos$,
      this.curentProject$
    ]).pipe(
      map(([repos, projectId]) => repos[projectId])
    );
}