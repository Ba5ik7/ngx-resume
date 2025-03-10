import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  inject,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, tap } from 'rxjs';
import { ParametricHeartComponent } from '../shared/components/parametric-heart/parametric-heart.component';
import { CommandLineService } from './command-line.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-command-line',
    imports: [CommonModule, ParametricHeartComponent],
    template: `
    @if (viewModel$ | async; as vm) {
    <main>
      <div class="crt">
        <ngx-parametric-heart></ngx-parametric-heart>
        <div #terminalDiv class="terminal-container"></div>
      </div>
    </main>
    }
  `,
    styleUrl: './command-line.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandLineComponent {
  zone = inject(NgZone);
  router = inject(Router);
  terminalSignal = viewChild<ElementRef>('terminalDiv');

  viewModel$ = combineLatest([toObservable(this.terminalSignal)]).pipe(
    tap(([terminalDiv]) =>
      this.zone.runOutsideAngular(
        () => terminalDiv && new CommandLineService(terminalDiv, this.router).init()
      )
    )
  );
}
