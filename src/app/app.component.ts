import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      // background-color: #3b2c00;
      background-color: #000;
      color: #7bb368;
    }
  `],
})
export class AppComponent {
  title = 'ngx-resume';
}
