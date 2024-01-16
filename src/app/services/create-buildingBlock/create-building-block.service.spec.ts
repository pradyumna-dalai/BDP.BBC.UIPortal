import { TestBed } from '@angular/core/testing';

import { CreateBuildingBlockService } from './create-building-block.service';

describe('CreateBuildingBlockService', () => {
  let service: CreateBuildingBlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateBuildingBlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
