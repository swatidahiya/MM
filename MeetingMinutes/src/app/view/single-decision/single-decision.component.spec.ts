import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDecisionComponent } from './single-decision.component';

describe('SingleDecisionComponent', () => {
  let component: SingleDecisionComponent;
  let fixture: ComponentFixture<SingleDecisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDecisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
