import { TestBed } from '@angular/core/testing';

import { CreatAdjacentyFromGraphService } from './creat-adjacenty-from-graph.service';

describe('CreatAdjacentyFromGraphService', () => {
  let service: CreatAdjacentyFromGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatAdjacentyFromGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
