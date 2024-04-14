import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, tap } from 'rxjs';
import { ParametricHeartComponent } from '../shared/components/parametric-heart/parametric-heart.component';
import { CommandLineService } from './command-line.service';

@Component({
  selector: 'app-command-line',
  standalone: true,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandLineComponent {
  terminalSignal = viewChild<ElementRef>('terminalDiv');

  viewModel$ = combineLatest([toObservable(this.terminalSignal)]).pipe(
    tap(
      ([terminalDiv]) =>
        terminalDiv && new CommandLineService(terminalDiv).init()
    )
  );
}
