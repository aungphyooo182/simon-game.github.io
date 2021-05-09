import { TestBed } from '@angular/core/testing';

import { ApoGameStateService } from './apo-game-state.service';

describe('ApoGameStateService', () => {
  let service: ApoGameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApoGameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
