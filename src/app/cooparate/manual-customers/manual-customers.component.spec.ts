import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualCustomersComponent } from './manual-customers.component';

describe('ManualCustomersComponent', () => {
  let component: ManualCustomersComponent;
  let fixture: ComponentFixture<ManualCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
