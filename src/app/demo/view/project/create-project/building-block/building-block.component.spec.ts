import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingBlockComponent } from './building-block.component';

describe('BuildingBlockComponent', () => {
  let component: BuildingBlockComponent;
  let fixture: ComponentFixture<BuildingBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingBlockComponent]
    });
    fixture = TestBed.createComponent(BuildingBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
