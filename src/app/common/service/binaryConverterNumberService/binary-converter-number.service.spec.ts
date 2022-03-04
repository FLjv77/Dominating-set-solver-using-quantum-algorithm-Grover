import { TestBed } from '@angular/core/testing';

import { BinaryConverterNumberService } from './binary-converter-number.service';

describe('BinaryConverterNumberService', () => {
  let service: BinaryConverterNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinaryConverterNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
