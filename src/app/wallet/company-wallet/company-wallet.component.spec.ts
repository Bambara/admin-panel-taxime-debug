import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyWalletComponent } from './company-wallet.component';

describe('CompanyWalletComponent', () => {
  let component: CompanyWalletComponent;
  let fixture: ComponentFixture<CompanyWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
