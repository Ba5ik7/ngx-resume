import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Resolve } from '@angular/router';

interface Repo {
  name: string;
  description: string;
  html_url: string;
  owner: { login: string; avatar_url: string };
}

interface Commit {
  commit: { message: string; author: { date: string } };
  html_url: string;
}

interface RepoWithCommit {
  name: string;
  description: string;
  url: string;
  owner: string;
  avatar: string;
  latestCommit: string;
  commitUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class GithubReposResolver implements Resolve<Observable<any[]>> {
  constructor(private githubService: GithubService) {}

  resolve(): Observable<any[]> {
    return this.githubService.getRecentRepos();
  }
}

interface Repo {
  name: string;
  description: string;
  html_url: string;
  owner: { login: string; avatar_url: string };
}

interface Commit {
  commit: { message: string; author: { date: string } };
  html_url: string;
}

interface RepoWithCommit {
  name: string;
  description: string;
  url: string;
  owner: string;
  avatar: string;
  latestCommit: string;
  commitUrl: string;
  previewImage: string; // Adding preview image field
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly GITHUB_API_URL = 'https://api.github.com';
  private readonly USERNAME = 'ba5ik7';
  private readonly REPO_LIMIT = 10;

  repos = new BehaviorSubject<RepoWithCommit[]>([]);
  repos$ = this.repos.asObservable();

  constructor(private httpClient: HttpClient) {}

  getRecentRepos(): Observable<any[]> {
    return of([
      {
        name: 'ngx-repo1',
        description: `Ngx-EditorJs2 is an Angular-based, highly extensible block-style editor inspired by Editor.js. It allows users to create and manage rich text content using a variety of customizable blocks while leveraging Angular's reactive capabilities.`,
        url: 'url1',
        owner: 'owner1',
        avatar: 'avatar1',
        latestCommit: 'latestCommit1',
        commitUrl: 'commitUrl1',
        previewImage: 'https://dummyimage.com/600x400/000/fff',
      },
      {
        name: 'ngex-repo2',
        description: `Ngx-EditorJs2 is an Angular-based, highly extensible block-style editor inspired by Editor.js. It allows users to create and manage rich text content using a variety of customizable blocks while leveraging Angular's reactive capabilities.`,
        url: 'url2',
        owner: 'owner2',
        avatar: 'avatar2',
        latestCommit: 'latestCommit2',
        commitUrl: 'commitUrl2',
        previewImage: 'https://dummyimage.com/600x400/000/fff',
      },
      {
        name: 'ngx-repo1',
        description: `Ngx-EditorJs2 is an Angular-based, highly extensible block-style editor inspired by Editor.js. It allows users to create and manage rich text content using a variety of customizable blocks while leveraging Angular's reactive capabilities.`,
        url: 'url1',
        owner: 'owner1',
        avatar: 'avatar1',
        latestCommit: 'latestCommit1',
        commitUrl: 'commitUrl1',
        previewImage: 'https://dummyimage.com/600x400/000/fff',
      },
      {
        name: 'ngex-repo2',
        description: `Ngx-EditorJs2 is an Angular-based, highly extensible block-style editor inspired by Editor.js. It allows users to create and manage rich text content using a variety of customizable blocks while leveraging Angular's reactive capabilities.`,
        url: 'url2',
        owner: 'owner2',
        avatar: 'avatar2',
        latestCommit: 'latestCommit2',
        commitUrl: 'commitUrl2',
        previewImage: 'https://dummyimage.com/600x400/000/fff',
      },
      {
        name: 'ngx-repo1',
        description: `Ngx-EditorJs2 is an Angular-based, highly extensible block-style editor inspired by Editor.js. It allows users to create and manage rich text content using a variety of customizable blocks while leveraging Angular's reactive capabilities.`,
        url: 'url1',
        owner: 'owner1',
        avatar: 'avatar1',
        latestCommit: 'latestCommit1',
        commitUrl: 'commitUrl1',
        previewImage: 'https://dummyimage.com/600x400/000/fff',
      },
      {
        name: 'ngex-repo2',
        description: `Ngx-EditorJs2 is an Angular-based, highly extensible block-style editor inspired by Editor.js. It allows users to create and manage rich text content using a variety of customizable blocks while leveraging Angular's reactive capabilities.`,
        url: 'url2',
        owner: 'owner2',
        avatar: 'avatar2',
        latestCommit: 'latestCommit2',
        commitUrl: 'commitUrl2',
        previewImage: 'https://dummyimage.com/600x400/000/fff',
      },
      {
        name: 'ngx-repo1',
        description: `Ngx-EditorJs2 is an Angular-based, highly extensible block-style editor inspired by Editor.js. It allows users to create and manage rich text content using a variety of customizable blocks while leveraging Angular's reactive capabilities.`,
        url: 'url1',
        owner: 'owner1',
        avatar: 'avatar1',
        latestCommit: 'latestCommit1',
        commitUrl: 'commitUrl1',
        previewImage: 'https://dummyimage.com/600x400/000/fff',
      },
      {
        name: 'ngex-repo2',
        description: `Ngx-EditorJs2 is an Angular-based, highly extensible block-style editor inspired by Editor.js. It allows users to create and manage rich text content using a variety of customizable blocks while leveraging Angular's reactive capabilities.`,
        url: 'url2',
        owner: 'owner2',
        avatar: 'avatar2',
        latestCommit: 'latestCommit2',
        commitUrl: 'commitUrl2',
        previewImage: 'https://dummyimage.com/600x400/000/fff',
      },
      {
        name: 'ngx-repo1',
        description: `Ngx-EditorJs2 is an Angular-based, highly extensible block-style editor inspired by Editor.js. It allows users to create and manage rich text content using a variety of customizable blocks while leveraging Angular's reactive capabilities.`,
        url: 'url1',
        owner: 'owner1',
        avatar: 'avatar1',
        latestCommit: 'latestCommit1',
        commitUrl: 'commitUrl1',
        previewImage: 'https://dummyimage.com/600x400/000/fff',
      },
      {
        name: 'ngex-repo2',
        description: `Ngx-EditorJs2 is an Angular-based, highly extensible block-style editor inspired by Editor.js. It allows users to create and manage rich text content using a variety of customizable blocks while leveraging Angular's reactive capabilities.`,
        url: 'url2',
        owner: 'owner2',
        avatar: 'avatar2',
        latestCommit: 'latestCommit2',
        commitUrl: 'commitUrl2',
        previewImage: 'https://dummyimage.com/600x400/000/fff',
      },
    ]).pipe(tap((repos: RepoWithCommit[]) => this.repos.next(repos)));
    return this.httpClient
      .get<Repo[]>(
        `${this.GITHUB_API_URL}/users/${this.USERNAME}/repos?sort=updated&per_page=${this.REPO_LIMIT}`
      )
      .pipe(
        switchMap((repos) => {
          const commitRequests = repos.map((repo) =>
            this.getLatestCommit(repo.owner.login, repo.name)
          );
          return forkJoin(commitRequests).pipe(
            map((commits) =>
              repos.map((repo, index) => ({
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                owner: repo.owner.login,
                avatar: repo.owner.avatar_url,
                latestCommit:
                  commits[index]?.commit.message ?? 'No recent commits',
                commitUrl: commits[index]?.html_url ?? repo.html_url,
                previewImage: `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`,
              }))
            )
          );
        }),
        tap((repos: RepoWithCommit[]) => this.repos.next(repos))
      );
  }

  /** Fetches the latest commit for a specific repo */
  private getLatestCommit(owner: string, repo: string): Observable<Commit> {
    return this.httpClient
      .get<Commit[]>(
        `${this.GITHUB_API_URL}/repos/${owner}/${repo}/commits?per_page=1`
      )
      .pipe(
        map(
          (commits) =>
            commits[0] || {
              commit: { message: 'No commits yet', author: { date: '' } },
              html_url: '',
            }
        )
      );
  }
}
