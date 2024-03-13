import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostItemComponent } from './cost-item.component';

describe('CostItemComponent', () => {
  let component: CostItemComponent;
  let fixture: ComponentFixture<CostItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CostItemComponent]
    });
    fixture = TestBed.createComponent(CostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
