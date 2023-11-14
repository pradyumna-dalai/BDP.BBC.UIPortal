import { TestBed } from '@angular/core/testing';

import { ApiEmptyResponseInterceptor } from './api-empty-response.interceptor';

describe('ApiEmptyResponseInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiEmptyResponseInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ApiEmptyResponseInterceptor = TestBed.inject(ApiEmptyResponseInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
