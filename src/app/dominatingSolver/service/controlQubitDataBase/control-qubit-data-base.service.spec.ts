import { TestBed } from '@angular/core/testing';

import { ControlQubitDataBaseService } from './control-qubit-data-base.service';

describe('ControlQubitDataBaseService', () => {
  let service: ControlQubitDataBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlQubitDataBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
