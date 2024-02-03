import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCostComponent } from './project-cost.component';

describe('ProjectCostComponent', () => {
  let component: ProjectCostComponent;
  let fixture: ComponentFixture<ProjectCostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectCostComponent]
    });
    fixture = TestBed.createComponent(ProjectCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
