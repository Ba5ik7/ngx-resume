import { TestBed } from '@angular/core/testing';

import { CommandLineService } from './command-line.service';

describe('CommandLineService', () => {
  let service: CommandLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
