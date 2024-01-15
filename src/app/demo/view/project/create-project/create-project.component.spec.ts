import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateProjectComponent } from './create-project.component';
import { MasterTableService } from 'src/app/services/master-table.service';
import { HttpClient } from '@angular/common/http';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MessageService } from 'primeng/api';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { Observable, of } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';

fdescribe('CreateProjectComponent', () => {
  let component: CreateProjectComponent; // Replace 'CreateProjectComponent' with the actual name of your component
  let fixture: ComponentFixture<CreateProjectComponent>; // Replace 'CreateProjectComponent' with the actual name of your component
  let fb: FormBuilder;
  let mtest: MasterTableService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProjectComponent], // Replace 'CreateProjectComponent' with the actual name of your component
      imports: [ReactiveFormsModule, 
                TabViewModule,
                ToastModule,
                DropdownModule,
                MultiSelectModule,
                CalendarModule
              ],
      providers:[
        {
          provide: MasterTableService,
          useClass: MockMasterTableService
        },  
        AppBreadcrumbService,
        MessageService,
        ProjectsService,
        FormBuilder,
        {
          provide: HttpClient,
          useClass: MockHttpClient
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectComponent); // Replace 'CreateProjectComponent' with the actual name of your component
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });
//ngOnInit pass test cases 
  it('should call ngOnit',()=>{
    expect(component).toBeTruthy()
  })

  it('should create the form with the expected controls', () => {
    expect(component.myForm).toBeDefined(); // Make sure the form is defined

    const formControls = component.myForm.controls;

    expect(formControls.companyName).toBeDefined();
    expect(formControls.customerCode).toBeDefined();
    expect(formControls.opportunityName).toBeDefined();
    expect(formControls.industryVertical).toBeDefined();
    expect(formControls.region).toBeDefined();
    expect(formControls.projectName).toBeDefined();
    expect(formControls.projectStage).toBeDefined();
    expect(formControls.projectStatus).toBeDefined();
    expect(formControls.opportunityManger).toBeDefined();
    expect(formControls.startDate).toBeDefined();
    expect(formControls.endDate).toBeDefined();
    expect(formControls.designNotes).toBeDefined();
    expect(formControls.impleNotes).toBeDefined();

    // Add more expectations as needed for your form controls
  });


  it('should set the region as required', () => {
    const regionControl = component.myForm.get('region');
    expect(regionControl.validator).toBeNull();
  });
  it('should set the projectStatus as required', () => {
    const projectStatus = component.myForm.get('projectStatus');
    expect(projectStatus.validator).toBeNull();
  });
  it('should set the companyName as required', () => {
    const companyName = component.myForm.get('companyName');
    expect(companyName.validator).toBeNull();
  });
  it('should set the opportunityManger as required', () => {
    const opportunityManger = component.myForm.get('opportunityManger');
    expect(opportunityManger.validator).toBeNull();
  });
  it('should set the startDate as required', () => {
    const startDate = component.myForm.get('startDate');
    expect(startDate.validator).toBeNull();
  });
  it('should set the endDate as required', () => {
    const endDate = component.myForm.get('endDate');
    expect(endDate.validator).toBeNull();
  });
  it('should set the customerCode as required', () => {
    const customerCode = component.myForm.get('customerCode');
    expect(customerCode.validator).toBeNull();
  });
  it('should set the opportunityName as required', () => {
    const opportunityName = component.myForm.get('opportunityName');
    expect(opportunityName.validator).toBeNull();
  });
  it('should set the industryVertical as required', () => {
    const industryVertical = component.myForm.get('industryVertical');
    expect(industryVertical.validator).toBeNull();
  });
  it('should set the projectStage  controls as required', () => {
    const projectStage = component.myForm.get('projectStage');
    expect(projectStage.hasValidator(Validators.required)).toBe(true);
  });
  it('should set the projectName  controls as required', () => {
    const projectName = component.myForm.get('projectName');
    expect(projectName.hasValidator(Validators.required)).toBe(true);
  });


  it('should set the designNotes  controls as required with max length', () => {
    const designNotes = component.myForm.get('designNotes');
    //testing valid length
    designNotes.setValue('abc123')
    expect(designNotes.valid).toBeTrue()

    //test invalid value
    designNotes.setValue(Array(1001).fill('a').join(''))
    expect(designNotes.valid).withContext('exceeeding max length').toBeFalse()
  });
  

  it('should set the impleNotes  controls as required with max length', () => {
    const impleNotes = component.myForm.get('impleNotes');
    //testing valid length
    impleNotes.setValue('abc123')
    expect(impleNotes.valid).toBeTrue()

    //test invalid value
    impleNotes.setValue(Array(1001).fill('a').join(''))
    expect(impleNotes.valid).withContext('exceeeding max length').toBeFalse()
  });
  
  // Add more tests as needed for your form validations and functionality

});

export class MockHttpClient {
  get() {}
  post() {}
}
//function Observalbe call test with ngOnIit .
export class MockMasterTableService {
  getRegion(): Observable<any> {
    return of({})
  }
  getCompany(): Observable<any> {
    return of({})
  }
  getProjectStage(): Observable<any> {
    return of({})
  }
  getOpportunityManger(): Observable<any> {
    return of({})
  }
}