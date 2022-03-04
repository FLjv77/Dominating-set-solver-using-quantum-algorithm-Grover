import { TestBed } from '@angular/core/testing';

import { SchoningSolverService } from './schoning-solver.service';

describe('SchoningSolverService', () => {
  let service: SchoningSolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoningSolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
