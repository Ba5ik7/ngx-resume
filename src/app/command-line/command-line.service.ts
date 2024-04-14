import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommandLineService {

  prompt() {
    this.terminal.write('/Users/ba5ik7/ngx-resume on feature/showCase is 📦  v0.0.1 via ⬢ v20.10.0 \n');
    this.terminal.write('$ '); // Write a new line and prompt symbol
  }

  handleInput(data: string) {
    // Check if 'Enter' key was pressed
    if (data === '\r') {
      this.processCommand(this.buffer);
      this.buffer = ''; // Reset buffer after processing
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
        this.terminal.writeln('\r');
        this.terminal.clear();
        this.terminal.writeln(MESSAGE_OF_THE_DAY);
        break;
      case 'clear':
        this.terminal.writeln('\r');
        this.terminal.clear();
        break;
      case 'help':
        this.terminal.writeln('\r');
        this.terminal.clear();
        this.terminal.writeln('Available commands:');
        this.terminal.writeln('  help - Show this help message');
        this.terminal.writeln('  about - Show information about me');
        this.terminal.writeln('  projects - List my past projects');
        break;
      case 'about':
        this.terminal.clear();
        this.terminal.writeln('\r');
        this.terminal.writeln(ANGULAR_LOGO);
        this.terminal.writeln('I am Wesley DuSell, a software engineer with BLAH BLAH BLAH experience...');
        this.terminal.writeln('\r');
        break;
      case 'projects':
        this.terminal.writeln('\r');
        this.terminal.writeln('Past Projects:');
        this.terminal.writeln('  - Vanguard: Worked on numerous financial services platforms...');
        this.terminal.writeln('  - Editor.Js clone: An Angular implementation of the Editor.Js...');
        this.terminal.writeln('  - Ngx-Workshop: A workshop creation tool featuring CMS...');
        break;
      default:
        this.terminal.writeln(`\r`);
        this.terminal.writeln(`No such command: ${command}`);
        this.terminal.writeln(`Type help to show available commands `);
    }
  }
}
