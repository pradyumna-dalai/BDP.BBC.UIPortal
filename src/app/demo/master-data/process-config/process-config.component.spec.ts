import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessConfigComponent } from './process-config.component';

describe('ProcessConfigComponent', () => {
  let component: ProcessConfigComponent;
  let fixture: ComponentFixture<ProcessConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessConfigComponent]
    });
    fixture = TestBed.createComponent(ProcessConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
