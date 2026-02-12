import { TestBed } from '@angular/core/testing';
import { PerdidasService } from './perdidas.service';

describe('PerdidasService', () => {
  let service: PerdidasService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerdidasService]
    });
    service = TestBed.inject(PerdidasService);
  });
  // Unit/Logic Tests
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
