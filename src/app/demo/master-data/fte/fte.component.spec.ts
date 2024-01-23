import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FteComponent } from './fte.component';

describe('FteComponent', () => {
  let component: FteComponent;
  let fixture: ComponentFixture<FteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FteComponent]
    });
    fixture = TestBed.createComponent(FteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
