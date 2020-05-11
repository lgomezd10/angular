import { TestBed } from '@angular/core/testing';

import { PerdidasService } from './perdidas.service';

describe('PerdidasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerdidasService = TestBed.get(PerdidasService);
    expect(service).toBeTruthy();
  });
});
