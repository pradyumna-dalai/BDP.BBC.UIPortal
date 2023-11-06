import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBbComponent } from './create-bb.component';

describe('CreateBbComponent', () => {
  let component: CreateBbComponent;
  let fixture: ComponentFixture<CreateBbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBbComponent]
    });
    fixture = TestBed.createComponent(CreateBbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
