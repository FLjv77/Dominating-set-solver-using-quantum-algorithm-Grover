import { TestBed } from '@angular/core/testing';

import { OrderListOfPureStateQubitService } from './order-list-of-pure-state-qubit.service';

describe('OrderListOfPureStateQubitService', () => {
  let service: OrderListOfPureStateQubitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderListOfPureStateQubitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
