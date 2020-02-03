import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAuthDetailsComponent } from './company-auth-details.component';

describe('CompanyAuthDetailsComponent', () => {
  let component: CompanyAuthDetailsComponent;
  let fixture: ComponentFixture<CompanyAuthDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAuthDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAuthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
