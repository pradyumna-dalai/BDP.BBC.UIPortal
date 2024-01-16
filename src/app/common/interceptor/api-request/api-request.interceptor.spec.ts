import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiRequestInterceptor } from './api-request.interceptor';

describe('ApiRequestInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule],
    providers: [
      ApiRequestInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ApiRequestInterceptor = TestBed.inject(ApiRequestInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
