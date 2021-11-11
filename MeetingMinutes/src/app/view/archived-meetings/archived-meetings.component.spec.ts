import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedMeetingsComponent } from './archived-meetings.component';

describe('ArchivedMeetingsComponent', () => {
  let component: ArchivedMeetingsComponent;
  let fixture: ComponentFixture<ArchivedMeetingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedMeetingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
