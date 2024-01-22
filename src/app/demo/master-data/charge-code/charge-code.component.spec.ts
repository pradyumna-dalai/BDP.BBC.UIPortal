import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCodeComponent } from './charge-code.component';

describe('ChargeCodeComponent', () => {
  let component: ChargeCodeComponent;
  let fixture: ComponentFixture<ChargeCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChargeCodeComponent]
    });
    fixture = TestBed.createComponent(ChargeCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
