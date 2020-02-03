import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAuthComponent } from './company-auth.component';

describe('CompanyAuthComponent', () => {
  let component: CompanyAuthComponent;
  let fixture: ComponentFixture<CompanyAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
