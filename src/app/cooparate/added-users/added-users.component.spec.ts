import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedUsersComponent } from './added-users.component';

describe('AddedUsersComponent', () => {
  let component: AddedUsersComponent;
  let fixture: ComponentFixture<AddedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
