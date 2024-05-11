import { TestBed } from '@angular/core/testing';

import { CongeChartService } from './conge-chart.service';

describe('CongeChartService', () => {
  let service: CongeChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CongeChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
