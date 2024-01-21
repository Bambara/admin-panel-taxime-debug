import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDriversComponent } from './pending-drivers.component';

describe('PendingDriversComponent', () => {
  let component: PendingDriversComponent;
  let fixture: ComponentFixture<PendingDriversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingDriversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
