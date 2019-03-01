import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadersComponent } from './uploaders.component';

describe('UploadersComponent', () => {
  let component: UploadersComponent;
  let fixture: ComponentFixture<UploadersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
