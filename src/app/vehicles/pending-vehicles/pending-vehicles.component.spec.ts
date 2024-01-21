import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingVehiclesComponent } from './pending-vehicles.component';

describe('PendingVehiclesComponent', () => {
  let component: PendingVehiclesComponent;
  let fixture: ComponentFixture<PendingVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
