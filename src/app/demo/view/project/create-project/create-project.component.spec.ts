import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateProjectComponent } from './create-project.component';

describe('CreateBbComponent', () => {
  let component: CreateProjectComponent;
  let fixture: ComponentFixture<CreateProjectComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [CreateProjectComponent]
//     });
//     fixture = TestBed.createComponent(CreateProjectComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProjectComponent],
      imports: [ReactiveFormsModule, FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.myForm.valid).toBeFalsy();
  });

  it('should initialize the form with the expected controls', () => {
    expect(component.myForm).toBeTruthy();
    expect(component.myForm.get('companyName')).toBeTruthy();
    expect(component.myForm.get('startDate')).toBeTruthy();
    expect(component.myForm.get('endDate')).toBeTruthy();
    // Add more expectations for other form controls
  });

  it('should set form as invalid if required fields are empty', () => {
    component.myForm.setValue({
      companyName: 'Your Company',
      startDate: '',
      endDate: '',
      // Set other form values as needed
    });
    expect(component.myForm.valid).toBeFalsy();
  });

  it('should invalidate form if end date is not greater than start date', () => {
    const startDate = component.myForm.controls['startDate'];
    const endDate = component.myForm.controls['endDate'];

    // Set start date to today
    const today = new Date();
    startDate.setValue(today);

    // Set end date to a date before or equal to today
    const invalidEndDate = new Date(today);
    endDate.setValue(invalidEndDate);

    expect(component.myForm.valid).toBeFalsy();
    expect(endDate.hasError('invalidDates')).toBeTruthy();
  });

  it('should call SaveAsDraftProjects method when Save As Draft button is clicked', () => {
    spyOn(component, 'SaveAsDraftProjects');
    const button = fixture.debugElement.nativeElement.querySelector('.p-button-outlined');
    button.click();
    expect(component.SaveAsDraftProjects).toHaveBeenCalled();
  });

});
