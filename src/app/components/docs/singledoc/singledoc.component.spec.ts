import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingledocComponent } from './singledoc.component';

describe('SingledocComponent', () => {
  let component: SingledocComponent;
  let fixture: ComponentFixture<SingledocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingledocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingledocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
