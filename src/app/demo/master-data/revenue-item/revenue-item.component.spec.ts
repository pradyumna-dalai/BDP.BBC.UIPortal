import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueItemComponent } from './revenue-item.component';

describe('RevenueItemComponent', () => {
  let component: RevenueItemComponent;
  let fixture: ComponentFixture<RevenueItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevenueItemComponent]
    });
    fixture = TestBed.createComponent(RevenueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
