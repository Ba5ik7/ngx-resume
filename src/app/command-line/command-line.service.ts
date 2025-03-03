import { ElementRef, Injectable } from '@angular/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { BehaviorSubject } from 'rxjs';
import { ABOUT, HELP, MESSAGE_OF_THE_DAY, PROJECTS } from './static-messages';

@Injectable()
export class CommandLineService {
  constructor(terminal: ElementRef) {
    this.terminalDiv.next(terminal);
  }

  private buffer = '';
  private readonly terminalDiv = new BehaviorSubject<ElementRef | null>(null);
  private readonly fitAddon = new FitAddon();
  private readonly terminal = new Terminal({
    cursorBlink: true,
    fontFamily: 'Cascadia Code, monospace',
    fontSize: 16,
    convertEol: true,
    allowTransparency: true,
    theme: {
      background: 'rgba(0, 0, 0, 0)',
      foreground: '#7bb368',
    },
  });

  init() {
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.open(this.terminalDiv.value?.nativeElement);
    this.terminal.writeln(MESSAGE_OF_THE_DAY);
    this.terminal.onData((data) => this.handleInput(data));
    this.fitAddon.fit();
    this.prompt();
    this.terminal.focus();
  }

  prompt() {
    this.buffer = ''; // Reset buffer after processing
    this.terminal.writeln('Type help to show available commands');
    this.terminal.writeln('/Users/ba5ik7/ngx-resume on feature/showCase is 📦  v0.0.1 via ⬢ v20.10.0');
    this.terminal.write('$ '); // Write a new line and prompt symbol
  }

  handleInput(data: string) {
    // Check if 'Enter' key was pressed
    if (data === '\r') {
      this.processCommand(this.buffer);
      this.prompt();
    } else if (data === '\x7f') { // Handle backspace
      if (this.buffer.length > 0) {
        this.buffer = this.buffer.substring(0, this.buffer.length - 1);
        this.terminal.write('\b \b'); // Move cursor back, write space to erase, and move back again
      }
    } else {
      this.buffer += data;
      this.terminal.write(data);
    }
  }

  processCommand(command: string) {
    command = command.trim();
    switch(command.toLowerCase()) {
      case 'home':
        this.terminal.clear();
        this.terminal.writeln(MESSAGE_OF_THE_DAY);
        break;
      case 'clear':
        this.terminal.writeln('');
        this.terminal.clear();
        break;
      case 'help':
        this.terminal.writeln(HELP);
        break;
      case 'about':
        this.terminal.clear();
        this.terminal.writeln(ABOUT);
        break;
      case 'projects':
        this.terminal.clear();
        this.terminal.writeln(PROJECTS);
        break;
      default:
        this.terminal.writeln(`\r`);
        this.terminal.writeln(`No such command: ${command}`);
    }
  }
}
