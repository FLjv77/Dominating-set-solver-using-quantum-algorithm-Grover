import { TestBed } from '@angular/core/testing';

import { SATProducerFromAdjacencyMatrixService } from './satproducer-from-adjacency-matrix.service';

describe('SATProducerFromAdjacencyMatrixService', () => {
  let service: SATProducerFromAdjacencyMatrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SATProducerFromAdjacencyMatrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
