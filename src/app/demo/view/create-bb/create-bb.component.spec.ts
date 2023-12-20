import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateBbComponent } from './create-bb.component';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { AppModule } from 'src/app/app.module';

describe('CreateBbComponent', () => {
  let component: CreateBbComponent;
  let fixture: ComponentFixture<CreateBbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBbComponent],
      imports:[HttpClientTestingModule,AppModule],
      providers:[AppBreadcrumbService,{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => '1' // Set the value for testing purposes
            }
          }
        }
      }]
    });
    fixture = TestBed.createComponent(CreateBbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
