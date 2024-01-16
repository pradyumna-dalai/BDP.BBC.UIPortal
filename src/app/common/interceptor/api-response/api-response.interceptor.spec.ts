import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiResponseInterceptor } from './api-response.interceptor';
import { MessageService } from 'primeng/api';

describe('ApiResponseInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule],
    providers: [
      ApiResponseInterceptor,MessageService
      ]
  }));

  it('should be created', () => {
    const interceptor: ApiResponseInterceptor = TestBed.inject(ApiResponseInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
