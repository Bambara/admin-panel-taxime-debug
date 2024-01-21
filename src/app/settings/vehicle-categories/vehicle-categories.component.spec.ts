import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCategoriesComponent } from './vehicle-categories.component';

describe('VehicleCategoriesComponent', () => {
  let component: VehicleCategoriesComponent;
  let fixture: ComponentFixture<VehicleCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
