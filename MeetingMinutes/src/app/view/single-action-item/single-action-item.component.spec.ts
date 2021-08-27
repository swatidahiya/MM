import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleActionItemComponent } from './single-action-item.component';

describe('SingleActionItemComponent', () => {
  let component: SingleActionItemComponent;
  let fixture: ComponentFixture<SingleActionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleActionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleActionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
