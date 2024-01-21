import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsBookingComponent } from './trips-booking.component';

describe('TripsBookingComponent', () => {
  let component: TripsBookingComponent;
  let fixture: ComponentFixture<TripsBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripsBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
