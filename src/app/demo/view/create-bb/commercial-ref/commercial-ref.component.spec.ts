import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialRefComponent } from './commercial-ref.component';

describe('CommercialRefComponent', () => {
  let component: CommercialRefComponent;
  let fixture: ComponentFixture<CommercialRefComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommercialRefComponent]
    });
    fixture = TestBed.createComponent(CommercialRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
