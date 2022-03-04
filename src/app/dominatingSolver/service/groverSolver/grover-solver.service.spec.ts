import { TestBed } from '@angular/core/testing';

import { GroverSolverService } from './grover-solver.service';

describe('GroverSolverService', () => {
  let service: GroverSolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroverSolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
