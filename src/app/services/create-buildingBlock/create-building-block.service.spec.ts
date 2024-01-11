import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateBuildingBlockService } from './create-building-block.service';

describe('CreateBuildingBlockService', () => {
  let service: CreateBuildingBlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(CreateBuildingBlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
