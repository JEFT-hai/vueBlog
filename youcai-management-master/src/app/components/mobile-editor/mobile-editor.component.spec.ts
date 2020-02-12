import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileEditorComponent } from './mobile-editor.component';

describe('MobileEditorComponent', () => {
  let component: MobileEditorComponent;
  let fixture: ComponentFixture<MobileEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
