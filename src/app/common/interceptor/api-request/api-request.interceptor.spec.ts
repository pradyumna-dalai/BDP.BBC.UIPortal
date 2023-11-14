import { TestBed } from '@angular/core/testing';

import { ApiRequestInterceptor } from './api-request.interceptor';

describe('ApiRequestInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiRequestInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ApiRequestInterceptor = TestBed.inject(ApiRequestInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
