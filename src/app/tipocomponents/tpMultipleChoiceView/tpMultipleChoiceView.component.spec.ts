import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { tpMultipleChoiceView } from './tpMultipleChoiceView.component';

describe('tpMultipleChoiceView', () => {
  let component: tpMultipleChoiceView;
  let fixture: ComponentFixture<tpMultipleChoiceView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ tpMultipleChoiceView ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(tpMultipleChoiceView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
