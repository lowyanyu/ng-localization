import { TestBed } from '@angular/core/testing';

import { LocalizationService } from './ng-localization.service';

describe('LocalizationService', () => {
  let service: LocalizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
