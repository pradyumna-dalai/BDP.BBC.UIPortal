import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostLineItemComponent } from './cost-line-item.component';

describe('CostLineItemComponent', () => {
  let component: CostLineItemComponent;
  let fixture: ComponentFixture<CostLineItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CostLineItemComponent]
    });
    fixture = TestBed.createComponent(CostLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
