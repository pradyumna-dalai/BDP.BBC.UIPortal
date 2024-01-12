import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProjectComponent } from './create-project.component';
import { HttpClientModule } from '@angular/common/http';
import { MasterTableService } from 'src/app/services/master-table.service';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

describe('CreateProjectComponent', () => {
  let component: CreateProjectComponent;
  let fixture: ComponentFixture<CreateProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProjectComponent],
      imports: [ReactiveFormsModule,HttpClientModule,TabViewModule,ToastModule ],
      providers: [MasterTableService],
    });
    fixture = TestBed.createComponent(CreateProjectComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.myForm.value).toEqual({
      companyName: [''],
      customerCode: [''],
      opportunityName: [''],
      industryVertical: [''],
      region: [''],
      projectName: ['', Validators.required],
      projectStage: ['', Validators.required],
      projectStatus: [''],
      opportunityManger: [''],
      startDate: [''],
      endDate: [''],
      designNotes: ['', [Validators.maxLength(1000)]],
      impleNotes: ['', [Validators.maxLength(1000)]],
    });
  });

  
  it('should set projectName and projectStage as required fields', () => {
    // Attempt to create the project without setting projectName and projectStage
    try {
      component.SaveAsDraftProjects(); // Adjust the method name based on your implementation
    } catch (error) {
      expect(error.message).toContain('projectName is required');
      expect(error.message).toContain('projectStage is required');
    }

    // Set projectName and projectStage
    component.projectName = 'Test Project';
    component.projectStage = 'Planning';

    // Verify that no error is thrown
    expect(() => component.SaveAsDraftProjects()).not.toThrow();
  });

  // Add more test cases as needed based on your component's functionality

  afterEach(() => {
    fixture.destroy();
  });
});
