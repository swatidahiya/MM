import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickMeetingComponent } from './quick-meeting.component';

describe('QuickMeetingComponent', () => {
  let component: QuickMeetingComponent;
  let fixture: ComponentFixture<QuickMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
